import { AbstractParseTreeVisitor } from "antlr4ng";
import { RustLikeVisitor } from "./parser/grammar/RustLikeVisitor";
import {
  ProgContext,
  Stmt_listContext,
  StmtContext,
  DeclContext,
  Fn_declContext,
  Param_list_optContext,
  Param_listContext,
  ParamContext,
  Print_stmtContext,
  Break_stmtContext,
  Continue_stmtContext,
  Expr_stmtContext,
  If_stmtContext,
  While_loopContext,
  Block_stmtContext,
  Block_exprContext,
  ExprContext,
  PrimaryContext,
  Arg_list_optContext,
  If_exprContext,
  Array_literalContext,
  Tuple_exprContext,
  Range_exprContext,
  U32_exprContext,
  Str_exprContext,
  Bool_exprContext,
  TypeContext,
  Type_list_optContext,
} from "./parser/grammar/RustLikeParser";
import {
  OwnershipEnvironment,
  ParameterTypeOwnership,
  TypeOwnership,
  Type,
  deepCloneOwnershipEnvironment,
  mergeOwnershipEnvironments,
} from "./RustTypeAndOwnershipCheckerUtils";

class RustTypeAndOwnershipChecker
  extends AbstractParseTreeVisitor<TypeOwnership>
  implements RustLikeVisitor<TypeOwnership> {
  public ownership_environment: OwnershipEnvironment =
    new OwnershipEnvironment();
  private binop_arithmic_xs: string[] = ["+", "-", "*", "/"];
  private binop_comp_xs: string[] = ["==", "!=", "<", ">", "<=", ">="];

  private typesEqual(a: Type, b: Type): boolean {
    if (a === null || b === null) {
      return a === b;
    }

    if (typeof a === "string" && typeof b === "string") {
      // Handle primitive types
      if (a === "num" || a === "bool" || a === "string") {
        return a === b;
      }
      // Handle reference types
      if (a.startsWith("&") && b.startsWith("&")) {
        return this.typesEqual(a.slice(1), b.slice(1));
      }
      return a === b;
    } else if (typeof a === "object" && typeof b === "object") {
      if (a.type === "function" && b.type === "function") {
        if (a.params.length !== b.params.length) {
          return false;
        }
        for (let i = 0; i < a.params.length; i++) {
          if (!this.typesEqual(a.params[i], b.params[i])) {
            return false;
          }
        }
        return this.typesEqual(a.returnType, b.returnType);
      }
    }
    return false;
  }

  // ... rest of the class implementation ...
}

export default RustTypeAndOwnershipChecker; 