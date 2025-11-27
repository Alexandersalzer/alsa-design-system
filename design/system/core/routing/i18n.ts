/**
 * Handle locale change by redirecting to root of selected locale
 */
export const handleLocaleChange = (router: any, value: string | null) => {
  if (value) {
    // Simply redirect to root of selected locale
    router.push(`/${value}`);
  }
};