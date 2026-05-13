import { AlertCircle } from 'lucide-react';

export default function ErrorAlert({ error }) {
  if (!error) return null;

  const message = error?.response?.data?.message || error?.message || 'Something went wrong';

  const details = error?.response?.data?.details || error?.details || [];

  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-red-200">
      <div className="flex items-start gap-3">
        <AlertCircle
          className="mt-0.5 shrink-0"
          size={20}
        />

        <div className="flex-1">
          <p className="font-medium">
            {message}
          </p>

          {details.length > 0 && (
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-red-300">
              {details.map(
                (item, index) => (
                  <li
                    key={`${index}-${item.message}`}
                  >
                    {item.message}
                  </li>
                )
              )}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}