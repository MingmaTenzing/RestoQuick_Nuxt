export default defineNuxtRouteMiddleware(() => {
  const { isSignedIn, userId, isLoaded } = useAuth();

  if (!isLoaded.value) {
    return;
  }
  if (!isSignedIn.value && !userId.value) {
    return navigateTo("/sign-in");
  }
});
