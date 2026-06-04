import { clerkMiddleware } from "@clerk/nuxt/server";

export default clerkMiddleware((event) => {
  const { isAuthenticated } = event.context.auth();
  const isApiRoute = event.path.startsWith("/api");

  if (!isAuthenticated && isApiRoute) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized: User not signed in",
    });
  }
});
