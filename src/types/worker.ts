export type WorkerProfile = {
  worker_id: string
  worker_name: string
  phone_number: string
  vendor_id: string
  vendor_name: string
  role: "SUPERVISOR" | "TECHNICIAN" | "HELPER"
  photo_url: string | null
}
