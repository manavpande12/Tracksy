"use client";
import { updateDefaultAccount } from "@/actions/accounts";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import useFetch from "@/hooks/use-fetch";
import { ArrowDownRight, ArrowUpRight, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect } from "react";
import { toast } from "sonner";

const AccountCard = ({ account }) => {
  const { name, type, balance, id, isDefault } = account;

  const {
    data: updateAccount,
    error,
    fn: updateDefaultFn,
    loading: updateDefaultLoading,
  } = useFetch(updateDefaultAccount);

  const handleDefaultChange = async (event) => {
    event.preventDefault();
    if (isDefault) {
      toast.warning("You need atleast 1 default account");
      return;
    }
    await updateDefaultFn(id);
  };

  useEffect(() => {
    if (updateAccount?.success) {
      toast.success("Default account updated successfully.");
    }
  }, [updateAccount, updateDefaultLoading]);

  useEffect(() => {
    if (error) {
      toast.error(error.message || "Failed to update default account.");
    }
  }, [error]);

  return (
    <Card className="hover:shadow-md transition-shadow group relative">
      <Link href={`/account/${id}`}>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-semibold capitalize">
            {name}
          </CardTitle>
          {updateDefaultLoading ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <Switch
              checked={isDefault}
              disabled={updateDefaultLoading}
              onClick={handleDefaultChange}
              className="cursor-pointer"
            />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl  font-bold gradient-title">
            ₹{parseFloat(balance).toFixed(2)}
          </div>
          <p className="text-sm text-muted-foreground">
            {type.charAt(0).toUpperCase() + type.slice(1).toLowerCase()} Account
          </p>
        </CardContent>
        <CardFooter className="flex justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <ArrowUpRight className="text-green-500 mr-1 s-4" /> Income
          </div>
          <div className="flex items-center">
            <ArrowDownRight className="text-red-500 mr-1 s-4" /> Expense
          </div>
        </CardFooter>
      </Link>
    </Card>
  );
};

export default AccountCard;
