import { CheckIcon } from 'lucide-react';

export const StepsIndicator = ({ step }: { step: number }) => {
  const steps = [
    { id: 1, name: 'Organization' },
    { id: 2, name: 'Master User' },
    { id: 3, name: 'Plan' },
  ];

  return (
    <div className="mb-8 flex w-full justify-center">
      <nav aria-label="Progress">
        <ol role="list" className="flex items-center">
          {steps.map((stepItem, stepIdx) => (
            <li
              key={stepItem.name}
              className={`relative ${stepIdx !== steps.length - 1 ? 'pr-8 sm:pr-20' : ''}`}
            >
              {step > stepItem.id ? (
                <>
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="h-0.5 w-full bg-primary" />
                  </div>
                  <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary">
                    <CheckIcon
                      className="h-5 w-5 text-white dark:invert"
                      aria-hidden="true"
                    />
                    <span className="sr-only">{stepItem.name}</span>
                  </div>
                </>
              ) : step === stepItem.id ? (
                <>
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="h-0.5 w-full bg-gray-200" />
                  </div>
                  <div
                    className="relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-primary bg-white"
                    aria-current="step"
                  >
                    <span
                      className="h-2.5 w-2.5 rounded-full bg-primary dark:invert"
                      aria-hidden="true"
                    />
                    <span className="sr-only">{stepItem.name}</span>
                  </div>
                </>
              ) : (
                <>
                  <div
                    className="absolute inset-0 flex items-center"
                    aria-hidden="true"
                  >
                    <div className="h-0.5 w-full bg-gray-200" />
                  </div>
                  <div className="group relative flex h-8 w-8 items-center justify-center rounded-full border-2 border-gray-300 bg-white">
                    <span
                      className="h-2.5 w-2.5 rounded-full bg-transparent group-hover:bg-gray-300"
                      aria-hidden="true"
                    />
                    <span className="sr-only">{stepItem.name}</span>
                  </div>
                </>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </div>
  );
};
