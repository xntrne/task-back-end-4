export function formatZodErrors(zodError) {
  const errors = {};

  for (const issue of zodError.issues) {
    const field = issue.path[0] ?? "form";

    if (!errors[field]) {
      errors[field] = { errors: [] };
    }

    errors[field].errors.push(issue.message);
  }

  return errors;
}
