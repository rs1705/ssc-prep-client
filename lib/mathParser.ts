interface NumberNode {
  type: "NUMBER";
  value: number;
}

interface OperatorNode {
  type: "OPERATOR";
  operator: string;
  left?: AstNode;
  right?: AstNode;
}

type AstNode = NumberNode | OperatorNode;
