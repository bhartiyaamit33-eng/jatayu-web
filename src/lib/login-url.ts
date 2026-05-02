export function getLoginUrl() {
  return (
    process.env.NEXT_PUBLIC_LOGIN_URL ?? "https://app.jatayuhealth.com/login"
  );
}
