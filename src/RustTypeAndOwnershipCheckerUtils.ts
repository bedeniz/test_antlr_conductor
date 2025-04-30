export type Type = string | { type: "function"; params: Type[]; returnType: Type } | null;

export type TypeOwnership = {
  type: Type;
  is_mutable: boolean;
  is_owned: boolean;
};

export type ParameterTypeOwnership = {
  type: Type;
  is_mutable: boolean;
  is_owned: boolean;
  name: string;
};

export class OwnershipEnvironment {
  private variables: Map<string, TypeOwnership>;
  private functions: Map<string, { params: ParameterTypeOwnership[]; returnType: TypeOwnership }>;

  constructor() {
    this.variables = new Map();
    this.functions = new Map();
  }

  public setVariable(name: string, ownership: TypeOwnership): void {
    this.variables.set(name, ownership);
  }

  public getVariable(name: string): TypeOwnership | undefined {
    return this.variables.get(name);
  }

  public setFunction(
    name: string,
    params: ParameterTypeOwnership[],
    returnType: TypeOwnership
  ): void {
    this.functions.set(name, { params, returnType });
  }

  public getFunction(
    name: string
  ): { params: ParameterTypeOwnership[]; returnType: TypeOwnership } | undefined {
    return this.functions.get(name);
  }

  public getAllVariables(): [string, TypeOwnership][] {
    return Array.from(this.variables.entries());
  }

  public getAllFunctions(): [string, { params: ParameterTypeOwnership[]; returnType: TypeOwnership }][] {
    return Array.from(this.functions.entries());
  }

  public clone(): OwnershipEnvironment {
    const env = new OwnershipEnvironment();
    this.variables.forEach((value, key) => {
      env.variables.set(key, { ...value });
    });
    this.functions.forEach((value, key) => {
      env.functions.set(key, {
        params: value.params.map((p) => ({ ...p })),
        returnType: { ...value.returnType },
      });
    });
    return env;
  }
}

export function deepCloneOwnershipEnvironment(env: OwnershipEnvironment): OwnershipEnvironment {
  return env.clone();
}

export function mergeOwnershipEnvironments(
  env1: OwnershipEnvironment,
  env2: OwnershipEnvironment
): OwnershipEnvironment {
  const merged = new OwnershipEnvironment();
  
  // Merge variables from env1
  for (const [key, value] of env1.getAllVariables()) {
    merged.setVariable(key, { ...value });
  }
  
  // Merge variables from env2
  for (const [key, value] of env2.getAllVariables()) {
    merged.setVariable(key, { ...value });
  }

  // Merge functions from env1
  for (const [key, value] of env1.getAllFunctions()) {
    merged.setFunction(
      key,
      value.params.map((p) => ({ ...p })),
      { ...value.returnType }
    );
  }

  // Merge functions from env2
  for (const [key, value] of env2.getAllFunctions()) {
    merged.setFunction(
      key,
      value.params.map((p) => ({ ...p })),
      { ...value.returnType }
    );
  }

  return merged;
} 