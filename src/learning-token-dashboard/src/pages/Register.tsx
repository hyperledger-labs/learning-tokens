import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { useEffect } from "react";
import { initWeb3 } from "../utils";
import { useRegisterAdminMutation } from "@/store/features/admin/adminApi";
import { useRegisterInstitutionMutation } from "@/store/features/institution/institutionApi";
import { useRegisterInstructorMutation } from "@/store/features/instructor/instructorApi";
import { useRegisterLearnerMutation } from "@/store/features/learner/learnerApi";
import { Button } from "@/components/ui/button";

const FormSchema = z
  .object({
    name: z.string().min(1, "Name is required."),
    email: z.string().email("Please enter a valid email address."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirm: z.string(),
    publicAddress: z.string().min(1, "Public address is required."),
    type: z.enum(["admin", "institution", "instructor", "learner"]),
    latitude: z.string().optional(),
    longitude: z.string().optional(),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Passwords do not match",
    path: ["confirm"],
  });

const Register = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm: "",
      publicAddress: "",
      type: "learner",
      latitude: "",
      longitude: "",
    },
  });

  const [registerAdmin] = useRegisterAdminMutation();
  const [registerInstitution] = useRegisterInstitutionMutation();
  const [registerInstructor] = useRegisterInstructorMutation();
  const [registerLearner] = useRegisterLearnerMutation();
  const dispatch = useDispatch();

  const onSubmit = async (values: z.infer<typeof FormSchema>) => {
    try {
      let result;
      switch (values.type) {
        case "admin":
          result = await registerAdmin(values).unwrap();
          break;
        case "institution":
          result = await registerInstitution(values).unwrap();
          break;
        case "instructor": {
          const contract = await initWeb3();
          const tx = await contract!.registerInstructor(
            values.name,
            Date.now()
          );
          if (tx) {
            result = await registerInstructor(values).unwrap();
          }
          break;
        }
        case "learner": {
          const learnerContract = await initWeb3();
          const learnerTx = await learnerContract!.registerLearner(
            values.name,
            Date.now(),
            values.latitude,
            values.longitude
          );
          if (learnerTx) {
            result = await registerLearner(values).unwrap();
          }
          break;
        }
      }

      if (result && result.status === 201) {
        toast.success("Successfully Registered");
        console.log(result);

        dispatch(userLoggedIn({ ...result.result, registered: true }));
      }
    } catch (e) {
      console.error(e);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        form.setValue("latitude", position.coords.latitude.toString());
        form.setValue("longitude", position.coords.longitude.toString());
      });
    }
  }, []);

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
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            name="confirm"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="publicAddress"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Public Address</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>User Type</FormLabel>
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
          {(form.watch("type") === "learner" ||
            form.watch("type") === "institution") && (
            <>
              <FormField
                control={form.control}
                name="latitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Latitude</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="longitude"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Longitude</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </>
          )}
          <Button type="submit" className="w-full rounded-[5px]">
            Register
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default Register;
