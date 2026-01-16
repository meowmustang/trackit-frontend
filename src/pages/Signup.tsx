import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import NotchedInput from "../components/ui/auth/NotchedInput"
import PrimaryButton from "../components/ui/auth/PrimaryButton"
import AuthResultModal from "../components/ui/popup/AuthResultModal"
import { compressImage } from "../assets/photocomp/PhotoComp"

const VENDORS = [
  { id: 1, name: "Multiflex" },
  { id: 2, name: "Narsi" },
  { id: 3, name: "Siemens" },
  { id: 4, name: "BSL-ELE" },
  { id: 5, name: "BSL-HVAC" },
  { id: 6, name: "BSL-FF" },
  { id: 7, name: "BSL-PHE" },
  { id: 8, name: "Bluestar" },
]

export default function Signup() {
  const navigate = useNavigate()

  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [vendorId, setVendorId] = useState<number | "">("")
  const [photo, setPhoto] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [modalStatus, setModalStatus] =
    useState<"success" | "error" | null>(null)

  /* ---------------- PHOTO HANDLERS ---------------- */

  const handlePhotoSelect = (file: File) => {
    setPhoto(file)
    setPhotoPreview(URL.createObjectURL(file))
  }

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handlePhotoSelect(e.target.files[0])
    }
  }

  /* ---------------- SIGNUP HANDLER ---------------- */

  const handleSignup = async () => {
   if (!name || !phone || !vendorId || !photo) {
  setError("All fields are required")
  return
}

if (phone.length !== 10) {
  setError("Phone number must be exactly 10 digits")
  return
}

    try {
      setLoading(true)
      setError("")

      const compressedPhoto = await compressImage(photo)

      const formData = new FormData()
      formData.append("worker_id", "W" + Date.now())
      formData.append("worker_name", name)
      formData.append("phone_number", phone)
      formData.append("vendor_id", vendorId.toString())
      formData.append("photo", compressedPhoto)

      const res = await fetch(
        '${import.meta.env.VITE_API_BASE_URL}/api/labour/auth/signup',
        {
          method: "POST",
          body: formData,
        }
      )

      if (!res.ok) {
        throw new Error("Signup failed")
      }

      setModalStatus("success")
    } catch (err) {
      setModalStatus("error")
    } finally {
      setLoading(false)
    }
  }

  /* ---------------- JSX ---------------- */

  return (
    <>
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <div className="w-full max-w-sm flex flex-col">

          <div className="flex flex-col">
            <img
              src="/logos/trackit.svg"
              alt="TrackIt"
              className="h-20 mx-auto mb-14"
            />

            <h1 className="text-orange-500 text-3xl font-bold mb-8">
              SignUp
            </h1>
          </div>

          <div className="space-y-7">
            <NotchedInput
              label="Name"
              placeholder="Full Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

           <NotchedInput
              label="Phone"
              placeholder="Phone Number"
              value={phone}
              onChange={(e) => {
                const onlyDigits = e.target.value.replace(/\D/g, "")
                if (onlyDigits.length <= 10) {
                  setPhone(onlyDigits)
                }
              }}
              inputMode="numeric"
            />

            {/* Vendor */}
            <div className="relative">
              <label className="absolute -top-2 left-4 bg-white px-1 text-sm text-gray-700">
                Vendor
              </label>

              <select
                value={vendorId}
                onChange={(e) => setVendorId(Number(e.target.value))}
                className="w-full h-14 rounded-xl border border-orange-400 px-4"
              >
                <option value="">Select Vendor</option>
                {VENDORS.map(v => (
                  <option key={v.id} value={v.id}>
                    {v.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Photo */}
            <div className="space-y-3">
              {!photo && (
                <p className="text-sm text-gray-700 text-center">
                  Photo required
                </p>
              )}

              {photoPreview && (
                <div className="flex justify-center">
                  <img
                    src={photoPreview}
                    alt="Preview"
                    className="w-20 h-20 rounded-full object-cover border"
                  />
                </div>
              )}

              <div className="flex justify-center gap-3">
                <label className="px-4 py-2 rounded-md bg-gray-500 text-white text-sm cursor-pointer">
                  Take Photo
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={onFileChange}
                  />
                </label>

                <label className="px-4 py-2 rounded-md bg-gray-500 text-white text-sm cursor-pointer">
                  Choose File
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={onFileChange}
                  />
                </label>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">
                {error}
              </p>
            )}

            <PrimaryButton onClick={handleSignup} disabled={loading}>
              {loading ? "Signing up..." : "SignUp"}
            </PrimaryButton>

            <p className="text-center text-sm text-gray-600">
              Already Registered?{" "}
              <Link to="/login" className="text-orange-500 font-medium">
                Log in here.
              </Link>
            </p>
          </div>
        </div>
      </div>

      {modalStatus && (
        <AuthResultModal
          status={modalStatus}
          message={
            modalStatus === "success"
              ? "You are successfully registered"
              : "Signup failed. Please try again."
          }
          onClose={() => {
            setModalStatus(null)
            if (modalStatus === "success") navigate("/login")
          }}
        />
      )}
    </>
  )
}
