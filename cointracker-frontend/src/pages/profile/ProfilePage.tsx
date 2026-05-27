import { useAuth } from "@/hooks/UseAuth"

const ProfilePage = () => {
  const { user } = useAuth()

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-semibold">Profile</h1>

      <div className="border p-4">
        <p>ID: {user?.id}</p>
        <p>Email: {user?.email}</p>
        <p>Role: {user?.role}</p>
      </div>
    </div>
  )
}

export default ProfilePage