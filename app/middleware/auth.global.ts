// Define the routes you want to protect with `createRouteMatcher()`
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default defineNuxtRouteMiddleware((to) => {
<<<<<<< HEAD
  // Use the `useAuth()` composable to access the `isSignedIn` property
  const { isSignedIn, has, orgRole, orgId } = useAuth();
  const { user } = useUser();
  console.log(orgRole.value);

  console.log("im auth middleware checking auth");
  console.log(`user is signed in? ${isSignedIn.value}`);
  console.log(user.value);
=======
  const toast = useToast();
  const { isSignedIn, orgId } = useAuth();
  if (!isProtectedRoute(to)) {
    return;
  }

  const runtimeConfig = useRuntimeConfig();
  const allowedOrgId = runtimeConfig.public.CLERK_ORG_ID;
>>>>>>> 8fbe68f (sign in redirects to dashboard and now view demo also works as it signs it in a demo account automatically)

  if (!isSignedIn.value) {
    return navigateTo("/sign-in");
  }

  if (allowedOrgId && orgId.value !== allowedOrgId) {
    toast.error({
      title: "Access Denied",
      message: "You do not have permission to access this page.",
    });

    return navigateTo("/");
  }
});
