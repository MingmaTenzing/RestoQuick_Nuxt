// Define the routes you want to protect with `createRouteMatcher()`
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default defineNuxtRouteMiddleware((to) => {
  // Use the `useAuth()` composable to access the `isSignedIn` property
  const { isSignedIn, has, orgRole, orgId } = useAuth();
  const { user } = useUser();
  console.log(orgRole.value);

  console.log("im auth middleware checking auth");
  console.log(`user is signed in? ${isSignedIn.value}`);
  console.log(user.value);

  // Check if the user is not signed in and is trying to access a protected route
  // If so, redirect them to the sign-in page
  if (!isSignedIn.value && isProtectedRoute(to)) {
    return navigateTo("/sign-in");
  }
});
