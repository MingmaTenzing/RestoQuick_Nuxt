// Define the routes you want to protect with `createRouteMatcher()`
const isProtectedRoute = createRouteMatcher(["/dashboard(.*)"]);

export default defineNuxtRouteMiddleware((to) => {
  if (!isProtectedRoute(to)) {
    return;
  }

  const toast = useToast();
  const { isSignedIn, orgId } = useAuth();
  const runtimeConfig = useRuntimeConfig();
  const allowedOrgId = runtimeConfig.public.CLERK_ORG_ID;
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
