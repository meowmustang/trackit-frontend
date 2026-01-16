import type { WorkerProfile } from "../../../types/worker"

type props ={
profile: WorkerProfile
}
export default function GreetingCard({profile}:props) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex items-center justify-between">

      {/* Left: Text */}
      <div>
        <p className="text-gray-500 text-sm">Hello,</p>
        <h2 className="text-2xl font-semibold text-gray-900">
          {profile?.worker_name}
        </h2>

        <span className="inline-block mt-2 px-3 py-1 rounded-md text-sm bg-orange-100 text-orange-600">
          {profile?.vendor_name}
        </span>
      </div>

      {/* Right: Worker photo */}
      <img
        src={profile?.photo_url || "/default-avatar.png"}  // replace with actual user photo later
        alt="Worker"
        className="w-20 h-20 rounded-full object-cover border-2 border-white shadow-sm"
      />
    </div>
  )
}
