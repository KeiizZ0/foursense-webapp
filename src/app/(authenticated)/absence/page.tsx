"use client";

export default function Profile() {
  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col justify-center text-center w-150 h-100 gap-2.5 border border-gray-200 rounded-2xl shadow-xs p-5">
        <h2 className="text-2xl font-medium">Atur Ulang Kata Sandi Anda</h2>
        <p className="border-b-2 border-gray-200 pb-5 mx-10">
          example@example.com
        </p>

        <p>
          Kami menerima permintaan untuk mengatur ulang kata sandi akun Anda.
        </p>

        <div className="bg-gray-50 p-5 text-center">
          <p>Kode Verifikasi Anda:</p>
          <h1 className="tracking-widest text-2xl">12345</h1>
          <p>
            <small>Kode ini akan kedaluwarsa dalam 10 menit.</small>
          </p>
        </div>

        <p>
          <strong>Bukan Anda yang meminta ini?</strong>
          <br />
          Jangan khawatir, akun Anda tetap aman. Cukup abaikan email ini dan
          tidak ada perubahan yang akan dilakukan pada akun Anda.
        </p>

        <hr />
        <p className="text-xs">
          Email ini dikirim secara otomatis, mohon tidak membalas email ini.
        </p>
      </div>
    </div>
  );
}
