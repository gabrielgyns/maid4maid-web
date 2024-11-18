import { useTranslation } from 'react-i18next';
import { MoreHorizontal, Pencil, Trash } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

type Row<T> = { original: T };

type ActionsCellProps<T> = {
  row?: Row<T>;
  onEdit: (row?: T) => void;
  onDelete: (row?: T) => void;
};

export function ActionsCell<T>({ row, onEdit, onDelete }: ActionsCellProps<T>) {
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>{t('Common.actions')}</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => (row ? onEdit(row.original) : onEdit())}
          className="cursor-pointer"
        >
          <Pencil className="mr-2 h-4 w-4" />
          <span>{t('Common.edit')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => (row ? onDelete(row.original) : onDelete())}
          className="cursor-pointer"
        >
          <Trash className="mr-2 h-4 w-4" />
          <span>{t('Common.delete')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
