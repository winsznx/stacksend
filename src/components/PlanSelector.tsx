import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { PLANS, type PlanKey } from '../utils/constants';

interface PlanSelectorProps {
    onPlanChange: (max: number) => void;
}

export const PlanSelector: React.FC<PlanSelectorProps> = ({ onPlanChange }) => {
    const [selected, setSelected] = useState<PlanKey>('starter');

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const plan = e.target.value as PlanKey;
        setSelected(plan);
        onPlanChange(PLANS[plan].maxRecipients);
    };

    return (
        <div className="relative">
            <select
                onChange={handleChange}
                value={selected}
                aria-label="Select recipient plan limit"
                title="Select recipient plan limit"
                className="appearance-none cursor-pointer pl-3 pr-8 py-2 text-sm font-medium rounded-lg transition-colors"
                style={{
                    backgroundColor: 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    border: '1px solid var(--border-color)'
                }}
            >
                {(Object.entries(PLANS) as [PlanKey, typeof PLANS[PlanKey]][]).map(([key, plan]) => (
                    <option key={key} value={key}>
                        {plan.name} ({plan.maxRecipients})
                    </option>
                ))}
            </select>
            <ChevronDown
                className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                style={{ color: 'var(--text-muted)' }}
            />
        </div>
    );
};
