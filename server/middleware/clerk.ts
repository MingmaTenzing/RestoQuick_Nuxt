import { clerkMiddleware } from "@clerk/nuxt/server";

export default clerkMiddleware((event) => {
  const { isAuthenticated } = event.context.auth();
  console.log("Clerk Middleware: isAuthenticated =", isAuthenticated);
  if (!isAuthenticated) {
    throw createError({
      statusCode: 401,
      statusMessage: "Unauthorized: User not signed in",
    });
  }
});
