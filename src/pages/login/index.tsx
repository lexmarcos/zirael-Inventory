import React, { useState } from "react";
import Sheet from "@mui/joy/Sheet";
import Typography from "@mui/joy/Typography";
import FormControl from "@mui/joy/FormControl";
import FormLabel from "@mui/joy/FormLabel";
import Input from "@mui/joy/Input";
import Button from "@mui/joy/Button";
import Link from "@mui/joy/Link";
import { useRouter } from "next/router";
import { setAuthToken } from "@/services/api";
import { login } from "@/services/api/auth";
import { Container } from "@mui/system";
import { styles } from "./styles";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const resp = await login(email, password);
    setAuthToken(resp.data.token);
    router.push("/");
  };

  return (
    <main>
      <Container maxWidth="sm" sx={styles.containerLogin}>
        <Sheet sx={styles.loginCard} variant="outlined">
          <div>
            <Typography level="h4" component="h1">
              <b>Welcome!</b>
            </Typography>
            <Typography level="body2">Sign in to continue.</Typography>
          </div>
          <form onSubmit={handleSubmit}>
            <FormControl>
              <FormLabel>Email</FormLabel>
              <Input name="email" type="email" placeholder="johndoe@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Password</FormLabel>
              <Input name="password" type="password" placeholder="password" value={password} onChange={(e) => setPassword(e.target.value)} />
            </FormControl>

            <Button type="submit" sx={{ mt: 1 }}>
              Log in
            </Button>
          </form>
          <Typography endDecorator={<Link href="/sign-up">Sign up</Link>} fontSize="sm" sx={{ alignSelf: "center" }}>
            Don&apos;t have an account?
          </Typography>
        </Sheet>
      </Container>
    </main>
  );
};

export default LoginPage;
