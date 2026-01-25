import { Button } from "@/components/ui/button";
import { useGetProfile } from "@/lib/hooks/profile";
import { useSession } from "next-auth/react";

interface EditProps {
  onSetEdit: (v: boolean) => void;
  edit: boolean;
}

const InfoItem = ({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) => (
  <div>
    <p className="text-sm font-medium text-gray-700">{label}</p>
    <p className="mt-1 text-gray-900">{value || "—"}</p>
  </div>
);

const UserDataShow = ({ onSetEdit, edit }: EditProps) => {
  const { data: session } = useSession();
  const id = session?.user.id || "";
  const { data } = useGetProfile(id);
  const profile = data?.data || session?.user;

  return (
    <div className="flex-1 bg-white rounded-lg border border-gray-200 p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Personal Information
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Manage your personal information and profile details.
          </p>
        </div>

        <Button
          onClick={() => onSetEdit(!edit)}
          className="bg-[#65A30D] cursor-pointer  hover:bg-primary/90 text-white gap-2"
        >
          Edit Profile
        </Button>
      </div>

      <div className="space-y-6">
        {/* Name */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem label="First Name" value={profile?.firstName} />
          <InfoItem label="Last Name" value={profile?.lastName} />
        </div>

        {/* Email & Phone */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem label="Email Address" value={profile?.email} />
          <InfoItem
            label="Phone Number"
            value={profile?.phoneNumber || profile?.phone}
          />
        </div>

        {/* Address */}
        <InfoItem
          label="Street Address"
          value={
            profile?.address?.roadArea || profile?.roadArea || profile?.street
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InfoItem
            label="Location"
            value={
              profile?.address?.country ||
              profile?.country ||
              profile?.address?.cityState ||
              profile?.cityState ||
              profile?.location
            }
          />
          <InfoItem
            label="Postal Code"
            value={profile?.address?.postalCode || profile?.postalCode}
          />
        </div>

        {/* Meta */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <InfoItem label="Role" value={profile?.role} />
          <InfoItem
            label="Verified"
            value={profile?.isVerified ? "Yes" : "No"}
          />
          <InfoItem
            label="Suspended"
            value={profile?.isSuspended ? "Yes" : "No"}
          />
        </div>
      </div>
    </div>
  );
};

export default UserDataShow;
