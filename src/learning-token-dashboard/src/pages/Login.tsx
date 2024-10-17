import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "../components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../components/ui/select";
import { Input } from "../components/ui/input";

import { userLoggedIn } from "../store/features/auth/authSlice";
import { useLoginAdminMutation } from "@/store/features/admin/adminApi";
import { useLoginInstitutionMutation } from "@/store/features/institution/institutionApi";
import { useLoginInstructorMutation } from "@/store/features/instructor/instructorApi";
import { useLoginLearnerMutation } from "@/store/features/learner/learnerApi";
import Button from "@/components/Button";

const FormSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  type: z.enum(["admin", "institution", "instructor", "learner"]),
});

const Login = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      email: "",
      password: "",
      type: "learner",
    },
  });

  const [loginAdmin] = useLoginAdminMutation();
  const [loginInstitution] = useLoginInstitutionMutation();
  const [loginInstructor] = useLoginInstructorMutation();
  const [loginLearner] = useLoginLearnerMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    const loginFunctions = {
      admin: loginAdmin,
      institution: loginInstitution,
      instructor: loginInstructor,
      learner: loginLearner,
    };

    try {
      if (values.type === "admin") {
        loginAdmin({
          email: values.email,
          password: values.password,
          type: values.type,
        })
          .unwrap()
          .then((res: any) => {
            if (res && res.status === 201) {
              dispatch(userLoggedIn(res.result));
              toast.success("Successfully Signed In");
              navigate("/");
            }
          })
          .catch((e: any) => {
            console.log(e);
            toast.error("Something went wrong");
          });
      } else if (values.type === "institution") {
        loginInstitution({
          email: values.email,
          password: values.password,
        })
          .unwrap()
          .then((res: any) => {
            if (res && res.status === 201) {
              dispatch(userLoggedIn(res.result));
              toast.success("Successfully Signed In");
              navigate("/");
            }
          })
          .catch((e: any) => {
            console.log(e);
            toast.error("Something went wrong");
          });
      } else if (values.type === "instructor") {
        loginInstructor({
          email: values.email,
          password: values.password,
        })
          .unwrap()
          .then((res: any) => {
            if (res && res.status === 201) {
              dispatch(userLoggedIn(res.result));
              toast.success("Successfully Signed In");
              navigate("/");
            }
          })
          .catch((e: any) => {
            console.log(e);
            toast.error("Something went wrong");
          });
      } else {
        loginLearner({
          email: values.email,
          password: values.password,
        })
          .unwrap()
          .then((res: any) => {
            if (res && res.status === 201) {
              dispatch(userLoggedIn(res.result));
              toast.success("Successfully Signed In");
              navigate("/");
            }
          })
          .catch((e: any) => {
            console.log(e);
            toast.error("Something went wrong");
          });
      }
    } catch (e) {}
  };

  return (
    <div className="">
      <div className="font-bold text-xl text-center my-3">Learning-Token</div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2 justify-between"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} type="email" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Login As</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select user type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="institution">Institution</SelectItem>
                    <SelectItem value="instructor">Instructor</SelectItem>
                    <SelectItem value="learner">Learner</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full rounded-[5px]">
            Login
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Login;
