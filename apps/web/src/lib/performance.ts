export function measurePerformance(name: string) {
  const start = performance.now();
  
  return {
    end: () => {
      const duration = performance.now() - start;
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚡ ${name}: ${duration.toFixed(2)}ms`);
      }
      return duration;
    },
  };
}

export async function withPerformance<T>(
  name: string,
  fn: () => Promise<T>
): Promise<T> {
  const measure = measurePerformance(name);
  try {
    return await fn();
  } finally {
    measure.end();
  }
}
