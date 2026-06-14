export function getLoginUrl() {
  return (
    process.env.NEXT_PUBLIC_LOGIN_URL ?? "https://www.voicedocai.com/loginPage"
  );
}
