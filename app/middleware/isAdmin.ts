export default defineNuxtRouteMiddleware(() => {
  const { has } = useAuth();

  const isAdmin = has.value({ role: "org:admin" }) ?? false;

  if (!isAdmin) {
    return navigateTo("/admin-only");
  }
});
