import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Stack, TextField, Typography } from "@mui/material";
import { useForm } from "react-hook-form";
import { Link as RouterLink, Navigate, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/common/LoadingSpinner";
import { useToast } from "../components/common/ToastProvider";
import PageWrapper from "../components/layout/PageWrapper";
import { useAuth } from "../hooks/useAuth";
import { SignupFormValues, signupSchema } from "../schemas/auth.schema";
import { getApiErrorMessage } from "../utils/apiError";

export default function SignupPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const { isAuthenticated, isCheckingAuth, signupMutation } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({
    resolver: zodResolver(signupSchema),
  });

  if (isCheckingAuth) {
    return <LoadingSpinner />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <PageWrapper>
      <div className="grid gap-6 md:grid-cols-2 md:items-stretch">
        <Stack spacing={3}>
          <Typography variant="h4">Create your account</Typography>
          <Typography color="text.secondary">
            Start organizing and sharing your events.
          </Typography>

          <form
            className="grid gap-4"
            onSubmit={handleSubmit((data) =>
              signupMutation.mutate(data, {
                onSuccess: () => {
                  showToast("Account created successfully.", "success");
                  navigate("/");
                },
                onError: (error) => {
                  showToast(
                    getApiErrorMessage(error, "Sign up failed."),
                    "error",
                  );
                },
              }),
            )}
          >
            <TextField
              label="Name"
              {...register("name")}
              error={Boolean(errors.name)}
              helperText={errors.name?.message}
            />
            <TextField
              label="Email"
              type="email"
              {...register("email")}
              error={Boolean(errors.email)}
              helperText={errors.email?.message}
            />
            <TextField
              label="Password"
              type="password"
              {...register("password")}
              error={Boolean(errors.password)}
              helperText={errors.password?.message}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={signupMutation.isPending}
            >
              {signupMutation.isPending ? "Creating account..." : "Sign Up"}
            </Button>
          </form>

          <Typography variant="body2">
            Already have an account? <RouterLink to="/login">Login</RouterLink>
          </Typography>
        </Stack>
      </div>
    </PageWrapper>
  );
}
