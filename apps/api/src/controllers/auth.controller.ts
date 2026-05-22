import { registerUser, loginUser } from "../services/auth.service";

export const register = async (req: any, res: any) => {
  try {
    const { name, email, password } = req.body;

    const result = await registerUser(name, email, password);

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};

export const login = async (req: any, res: any) => {
  try {
    const { email, password } = req.body;

    const result = await loginUser(email, password);

    res.json(result);
  } catch (err: any) {
    res.status(400).json({ message: err.message });
  }
};
