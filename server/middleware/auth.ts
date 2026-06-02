import { clerkMiddleware } from "@clerk/nuxt/server";

export default clerkMiddleware((event) => {
  const requestPath = getRequestURL(event).pathname;

  if (!requestPath.startsWith("/api")) {
    return;
  }

  const referer = getHeader(event, "referer");

  if (referer) {
    try {
      const refererPath = new URL(referer).pathname;

      if (refererPath === "/") {
        return;
      }
    } catch {
      // Ignore invalid referer values and continue with auth enforcement.
    }
  }
  const { isAuthenticated } = event.context.auth();

  if (!isAuthenticated) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized: User not signed in",
    });
  }
});
