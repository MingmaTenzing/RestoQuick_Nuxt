export default defineNuxtRouteMiddleware(() => {
  const { isSignedIn, userId } = useAuth();

  if (!isSignedIn.value && !userId.value) {
    return navigateTo("/sign-in");
  }
});
