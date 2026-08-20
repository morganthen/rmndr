export const throwFromResponse = async (
  res: Response,
  fallback: string,
): Promise<never> => {
  let message = fallback;
  try {
    const body = (await res.json()) as { message?: string };
    if (body.message) message = body.message;
  } catch {
    // body wasn't JSON — keep the fallback
  }
  throw new Error(message);
};
