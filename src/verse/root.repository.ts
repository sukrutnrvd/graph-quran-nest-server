import { Inject, Injectable } from '@nestjs/common';
import { Session } from 'neo4j-driver';
import { Driver } from 'neo4j-driver-core';
import { Utils } from 'src/utils/utils';

@Injectable()
export class RootRepository {
  private readonly session: Session;

  constructor(@Inject('NEO4J_DRIVER') private readonly driver: Driver) {
    this.session = this.driver.session();
  }

  async getRelationsForOneRoot(root: string) {
    return await this.session.run(
      `MATCH (root:Root {rootId: $rootId})-[occurs:OCCURS]-()
       WITH properties(occurs) as relations, root
       ORDER BY relations.surah, relations.verse
       RETURN root, COLLECT(DISTINCT relations) as relations
        `,
      { rootId: root },
    );
  }

  async getRelationsForMultipleRoots(roots: number[]) {
    const returnVariables =
      this.generateRelationsMultipleRootsReturnVariables(roots);

    const query = this.generateRelationsMultipleRootsQuery(
      roots,
      returnVariables,
    );

    const queryVariables =
      this.generateRelationsMultipleRootsQueryVariables(roots);

    return await this.session.run(query, queryVariables);
  }

  private generateRelationsMultipleRootsQuery(
    roots: number[],
    returnVariables: string,
  ) {
    return [
      this.generateMatchQuery(roots).join('\n'),
      this.generateWhereQuery(roots),
      `WITH ${returnVariables}`,
      `ORDER BY properties.surah, properties.verse`,
      `RETURN ${this.generateOrdinalRoots(roots)}, COLLECT(DISTINCT properties) as relations`,
    ].join('\n');
  }

  private generateRelationsMultipleRootsQueryVariables(roots: number[]) {
    return roots.reduce(
      (variables, root, index) => {
        const ordinal = Utils.numberToOrdinal(index + 1);
        variables[`${ordinal}RootId`] = root.toString();
        return variables;
      },
      {} as Record<string, string>,
    );
  }

  private generateRelationsMultipleRootsReturnVariables(roots: number[]) {
    return `${this.generateOrdinalRoots(roots)}, properties(r1) as properties`;
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

  private generateOrdinalRoots(roots: number[]) {
    return roots
      .map((_, i) => `${Utils.numberToOrdinal(i + 1)}Root`)
      .join(', ');
  }
}
