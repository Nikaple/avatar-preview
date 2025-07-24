export type FetchFunction = (url: string) => Promise<Response>;

export function isEdgeRuntime(): boolean {
  return process.env.NEXT_RUNTIME === 'edge';
}

export async function getFetch(): Promise<FetchFunction> {
  if (isEdgeRuntime()) {
    // Edge运行时使用原生fetch
    return fetch;
  } else {
    // Node.js运行时使用node-fetch
    try {
      const nodeFetch = (await import('node-fetch')).default;
      return nodeFetch as unknown as FetchFunction;
    } catch (error) {
      // 如果node-fetch未安装，回退到原生fetch
      return fetch;
    }
  }
}
