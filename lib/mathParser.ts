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

interface Token {
  type: "NUMBER" | "OPERATOR" | "LPAREN" | "RPAREN";
  value: string;
}

type AstNode = NumberNode | OperatorNode;

const PRECEDENCE: Record<string, number> = {
  "+": 1,
  "-": 1,
  "*": 2,
  "/": 2,
  "%": 2,
};

export function tokenize(input: string): Token[] {
  const tokens: Token[] = [];
  let current = 0;
  while (current < input.length) {
    let currentInput = input[current];
    if (currentInput === " ") {
      current++;
      continue;
    }
    if (currentInput === "+") {
      tokens.push({
        type: "OPERATOR",
        value: currentInput,
      });
    }
    if (currentInput === "-") {
      tokens.push({
        type: "OPERATOR",
        value: currentInput,
      });
    }
    if (currentInput === "*") {
      tokens.push({
        type: "OPERATOR",
        value: currentInput,
      });
    }
    if (currentInput === "/") {
      tokens.push({
        type: "OPERATOR",
        value: currentInput,
      });
    }
    if (currentInput === "(") {
      tokens.push({
        type: "LPAREN",
        value: currentInput,
      });
    }
    if (currentInput === ")") {
      tokens.push({
        type: "RPAREN",
        value: currentInput,
      });
    }

    if (/[0-9.]/.test(currentInput)) {
      let numberString = "";
      while (/[0-9]/.test(currentInput)) {
        numberString += currentInput;
        currentInput = input[++current];
      }
      tokens.push({
        type: "NUMBER",
        value: numberString,
      });
      current--;
    }

    current++;
  }

  return tokens;
}

export function buildAST(tokens: Token[]): AstNode {
  const nodeStack: AstNode[] = [];
  const operatorStack: Token[] = [];

  const attachOperator = () => {
    const operatorToken = operatorStack.pop();
    const right = nodeStack.pop();
    const left = nodeStack.pop();

    if (!operatorToken || !right || !left) {
      throw new Error("Invalid Expression");
    }

    nodeStack.push({
      type: "OPERATOR",
      operator: operatorToken.value,
      left,
      right,
    });
  };

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i];
    if (token.type === "NUMBER") {
      nodeStack.push({
        type: "NUMBER",
        value: parseFloat(token.value),
      });
    } else if (token.type === "LPAREN") {
      operatorStack.push(token);
    } else if (token.type === "RPAREN") {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1].type !== "LPAREN"
      ) {
        attachOperator();
      }
      operatorStack.pop();
    } else if (token.type === "OPERATOR") {
      while (
        operatorStack.length > 0 &&
        operatorStack[operatorStack.length - 1].type !== "LPAREN" &&
        PRECEDENCE[operatorStack[operatorStack.length - 1].value] >=
          PRECEDENCE[token.value]
      ) {
        attachOperator();
      }
      operatorStack.push(token);
    }
  }
  while (operatorStack.length > 0) {
    attachOperator();
  }

  return nodeStack[0];
}

export function evaluate(node: AstNode): number {
  if (node.type === "NUMBER") {
    return node.value;
  }
  if (node.type === "OPERATOR") {
    if (!node.left || !node.right) {
      throw new Error("Invalid expression");
    }

    const leftValue = evaluate(node.left);
    const rightValue = evaluate(node.right);

    switch (node.operator) {
      case "+":
        return leftValue + rightValue;
      case "-":
        return leftValue - rightValue;
      case "*":
        return leftValue * rightValue;
      case "/":
        return leftValue / rightValue;
      case "%":
        return leftValue % rightValue;
    }
  }

  throw new Error("Invalid node type");
}
