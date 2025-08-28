"use client";
import axios from "axios";
import { useEffect, useState, createContext } from "react";
import { useUser } from "@clerk/nextjs";

export type UsersDetail = {
  name: string;
  email: string;
  credits: number;
};

type UserDetailContextType = {
  userDetail: UsersDetail | null;
  setUserDetail: React.Dispatch<React.SetStateAction<UsersDetail | null>>;
};

export const UserDetailContext = createContext<UserDetailContextType | undefined>(undefined);

function Provider({ children }: Readonly<{ children: React.ReactNode }>) {
  const { user } = useUser();
  const [userDetail, setUserDetail] = useState<UsersDetail | null>(null);

  useEffect(() => {
    CreateNewUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const CreateNewUser = async () => {
    try {
      const result = await axios.post("/api/users");
        console.log(result.data);
        setUserDetail(result.data);
  
    } catch (err) {
      console.error("CreateNewUser error:", err);
    }
  };

  return (
    <div>
      <UserDetailContext.Provider value={{ userDetail, setUserDetail }}>
        {children}
      </UserDetailContext.Provider>
    </div>
  );
}

export default Provider;