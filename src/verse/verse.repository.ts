import { Inject, Injectable } from '@nestjs/common';
import { Session } from 'neo4j-driver';
import { Driver } from 'neo4j-driver-core';
import { Utils } from 'src/utils/utils';

@Injectable()
export class VerseRepository {
  private readonly session: Session;

  constructor(@Inject('NEO4J_DRIVER') private readonly driver: Driver) {
    this.session = this.driver.session();
  }

  async getContainForOneRoot(root: string) {
    return await this.session.run(
      `MATCH (root:Root {rootId: $rootId})-[occurs:OCCURS]-()
       WITH DISTINCT occurs.surah AS surah, occurs.verse AS verse, root
       RETURN surah,verse,root
       ORDER BY surah, verse
        `,
      { rootId: root },
    );
  }

  async getContainForMultipleRoots(roots: number[]) {
    const returnVariables =
      this.generateContainMultipleRootsReturnVariables(roots);

    const query = this.generateContainMultipleRootsQuery(
      roots,
      returnVariables,
    );

    const queryVariables =
      this.generateContainMultipleRootsQueryVariables(roots);

    return await this.session.run(query, queryVariables);
  }

  private generateContainMultipleRootsQuery(
    roots: number[],
    returnVariables: string,
  ) {
    return [
      this.generateMatchQuery(roots).join('\n'),
      this.generateWhereQuery(roots),
      `RETURN DISTINCT ${returnVariables}`,
      'ORDER BY properties(r1).surah, properties(r1).verse',
    ].join('\n');
  }

  private generateContainMultipleRootsQueryVariables(roots: number[]) {
    return roots.reduce(
      (variables, root, index) => {
        const ordinal = Utils.numberToOrdinal(index + 1);
        variables[`${ordinal}RootId`] = root.toString();
        return variables;
      },
      {} as Record<string, string>,
    );
  }

  private generateContainMultipleRootsReturnVariables(roots: number[]) {
    return (
      roots.map((_, i) => `${Utils.numberToOrdinal(i + 1)}Root`).join(', ') +
      ', properties(r1)'
    );
  }

  private generateMatchQuery(roots: number[]) {
    return roots.map((_, index) => {
      const ordinal = Utils.numberToOrdinal(index + 1);
      return `MATCH (${ordinal}Root:Root {rootId: $${ordinal}RootId})<-[r${index + 1}:OCCURS]->(commonNode)`;
    });
  }
  private generateWhereQuery(roots: number[]) {
    if (roots.length < 2) {
      throw new Error("Parameter 'roots' must have at least 2 elements");
    }
    const query = roots
      .map((_, index) => {
        if (index === roots.length - 1) {
          return null;
        }
        return `properties(r${index + 1}) = properties(r${index + 2})`;
      })
      .filter(Boolean) // Remove null values
      .join(' AND ');

    return `WHERE ${query}`;
  }
}
