import { ProfileForm } from "./ProfileForm";

export default function ProfilePage() {
  return (
    <div className="flex flex-1 flex-col gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-zinc-900 dark:text-zinc-50">Seu perfil</h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-300">
          Fotos ficam em <code className="text-xs">public/uploads</code> neste MVP (para produção, use storage na nuvem).
        </p>
      </div>
      <ProfileForm />
    </div>
  );
}
