import { useMemo, useState } from 'react'
import { Button, Form, Grid, Input, InputNumber, Modal, Popconfirm, Select, Space, Table, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Edit3, Plus, Search, Trash2 } from 'lucide-react'
import EmojiField from '@/components/ui/EmojiField'
import { useCategories } from '@/hooks/UseCategories'
import {
  useCreateTransaction,
  useDeleteTransaction,
  useUpdateTransaction,
} from '@/hooks/UseTransactionMutations'
import { useTransactions } from '@/hooks/UseTransactions'
import { getApiErrorMessage } from '@/lib/errors'
import { formatCurrency, formatDate, toDateInputValue } from '@/lib/format'
import { normalizeEmojiIcon, renderEntityIcon } from '@/lib/icons'
import type { CategoryType } from '@/types/category'
import type { Transaction, TransactionRequest, TransactionType } from '@/types/transaction'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'

type TransactionWorkspaceProps = {
  type: TransactionType
}

type TransactionFormValues = {
  name: string
  icon?: string
  amount?: number
  date: string
  categoryId: number
}

const pageTitle: Record<TransactionType, string> = {
  INCOME: 'Income',
  EXPENSE: 'Expenses',
}

const fallbackIcon: Record<TransactionType, string> = {
  INCOME: '\u{1F4B8}',
  EXPENSE: '\u{1F9FE}',
}

const TransactionWorkspace = ({ type }: TransactionWorkspaceProps) => {
  const [form] = Form.useForm<TransactionFormValues>()
  const [page, setPage] = useState(1)
  const [keyword, setKeyword] = useState('')
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [open, setOpen] = useState(false)

  const transactions = useTransactions({ type, page: page - 1, size: 10, keyword, sort: 'date,desc' })
  const categories = useCategories(type as CategoryType)
  const createMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction()
  const deleteMutation = useDeleteTransaction()
  const { preferences } = useUserPreferences()
  const screens = Grid.useBreakpoint()
  const compactTable = preferences.compactTables || screens.md === false

  const categoryOptions = useMemo(
    () =>
      (categories.data ?? []).map((category) => ({
        label: `${renderEntityIcon(category.icon, category.type === 'INCOME' ? '\u{1F4B0}' : '\u{1F9FE}')} ${category.name}`,
        value: category.id,
      })),
    [categories.data]
  )

  const openCreate = () => {
    setEditing(null)
    form.setFieldsValue({
      name: '',
      icon: fallbackIcon[type],
      amount: undefined,
      date: toDateInputValue(),
      categoryId: categoryOptions[0]?.value,
    })
    setOpen(true)
  }

  const openEdit = (transaction: Transaction) => {
    setEditing(transaction)
    form.setFieldsValue({
      name: transaction.name,
      icon: normalizeEmojiIcon(transaction.icon) ?? undefined,
      amount: Number(transaction.amount),
      date: transaction.date,
      categoryId: transaction.categoryId,
    })
    setOpen(true)
  }

  const handleSubmit = async (values: TransactionFormValues) => {
    const payload: TransactionRequest = {
      ...values,
      amount: values.amount ?? 0,
      icon: normalizeEmojiIcon(values.icon),
      type,
    }

    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, payload })
        message.success('Transaction updated')
      } else {
        await createMutation.mutateAsync(payload)
        message.success('Transaction created')
      }

      setOpen(false)
      form.resetFields()
    } catch (error) {
      message.error(getApiErrorMessage(error, 'Unable to save transaction'))
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id)
      message.success('Transaction deleted')
    } catch (error) {
      message.error(getApiErrorMessage(error, 'Unable to delete transaction'))
    }
  }

  const amountCell = (amount: number) => (
    <span
      className={`whitespace-nowrap ${
        type === 'INCOME' ? 'font-semibold text-emerald-700' : 'font-semibold text-rose-700'
      }`}
    >
      {preferences.hideAmounts ? 'Hidden' : `${type === 'INCOME' ? '+' : '-'}${formatCurrency(amount)}`}
    </span>
  )

  const actionCell = (transaction: Transaction) => (
    <Space size={compactTable ? 4 : 8} wrap={false}>
      <Button icon={<Edit3 size={15} />} onClick={() => openEdit(transaction)} />
      <Popconfirm title="Delete transaction?" onConfirm={() => handleDelete(transaction.id)}>
        <Button danger icon={<Trash2 size={15} />} />
      </Popconfirm>
    </Space>
  )

  const columns: ColumnsType<Transaction> = compactTable
    ? [
        {
          title: 'Transactions',
          dataIndex: 'name',
          render: (_, transaction) => (
            <div className="flex min-w-0 items-center gap-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-(--surface-muted) text-lg">
                {renderEntityIcon(transaction.icon, fallbackIcon[type])}
              </span>
              <div className="min-w-0">
                <p className="truncate font-medium text-(--foreground)">{transaction.name}</p>
                <p className="truncate text-xs text-(--muted)">
                  {formatDate(transaction.date)} - Category #{transaction.categoryId}
                </p>
              </div>
            </div>
          ),
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          align: 'right',
          width: 92,
          render: amountCell,
        },
        {
          title: '',
          key: 'actions',
          align: 'right',
          width: 86,
          render: (_, transaction) => actionCell(transaction),
        },
      ]
    : [
        {
          title: 'Name',
          dataIndex: 'name',
          render: (_, transaction) => (
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-(--surface-muted) text-xl">
                {renderEntityIcon(transaction.icon, fallbackIcon[type])}
              </span>
              <div>
                <p className="font-medium text-(--foreground)">{transaction.name}</p>
                <p className="text-sm text-(--muted)">Category #{transaction.categoryId}</p>
              </div>
            </div>
          ),
        },
        {
          title: 'Date',
          dataIndex: 'date',
          render: (date: string) => formatDate(date),
        },
        {
          title: 'Amount',
          dataIndex: 'amount',
          align: 'right',
          render: amountCell,
        },
        {
          title: '',
          key: 'actions',
          align: 'right',
          render: (_, transaction) => actionCell(transaction),
        },
      ]

  return (
    <div className="space-y-12">
      <section className="mb-3 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="brand-font text-3xl font-bold text-(--foreground)">{pageTitle[type]}</h1>
          <p className="mt-2 text-sm text-(--muted)">
            Add, refine, and review your {pageTitle[type].toLowerCase()} records with less noise.
          </p>
        </div>

        <Button
          type="primary"
          icon={<Plus size={16} />}
          onClick={openCreate}
          disabled={!categoryOptions.length}
          className="mt-2 sm:mt-0"
        >
          Add {type === 'INCOME' ? 'income' : 'expense'}
        </Button>
      </section>

      <section className="glass-panel rounded-2xl p-4 sm:p-7">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <Input
            allowClear
            prefix={<Search size={16} />}
            placeholder="Search by transaction name"
            value={keyword}
            onChange={(event) => {
              setKeyword(event.target.value)
              setPage(1)
            }}
            className="max-w-md"
          />
        </div>

        <Table<Transaction>
          rowKey="id"
          columns={columns}
          dataSource={transactions.data?.content ?? []}
          loading={transactions.isLoading}
          size={compactTable ? 'small' : 'middle'}
          scroll={compactTable ? undefined : { x: 720 }}
          className="overflow-hidden rounded-2xl"
          pagination={{
            current: page,
            pageSize: transactions.data?.size ?? 10,
            total: transactions.data?.totalElements ?? 0,
            onChange: setPage,
          }}
        />
      </section>

      <Modal
        title={editing ? 'Edit transaction' : `Add ${type === 'INCOME' ? 'income' : 'expense'}`}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        destroyOnHidden
        centered
      >
        {!categoryOptions.length ? (
          <p className="text-sm text-rose-600">Create a {type.toLowerCase()} category before adding transactions.</p>
        ) : (
          <Form<TransactionFormValues> form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
            <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Name is required' }]}>
              <Input placeholder="Salary, groceries, rent..." />
            </Form.Item>

            <Form.Item
              label={type === 'INCOME' ? 'Income category' : 'Expense category'}
              name="categoryId"
              rules={[{ required: true, message: 'Category is required' }]}
            >
              <Select options={categoryOptions} placeholder="Select category" />
            </Form.Item>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <Form.Item label="Amount" name="amount" rules={[{ required: true, message: 'Amount is required' }]}>
                <InputNumber min={0.01} precision={2} className="w-full" placeholder="0.00" />
              </Form.Item>

              <Form.Item label="Date" name="date" rules={[{ required: true, message: 'Date is required' }]}>
                <Input type="date" />
              </Form.Item>
            </div>

            <Form.Item label="Icon" name="icon">
              <EmojiField fallback={fallbackIcon[type]} />
            </Form.Item>

            <Button
              type="primary"
              htmlType="submit"
              block
              className="mt-2"
              loading={createMutation.isPending || updateMutation.isPending}
            >
              Save transaction
            </Button>
          </Form>
        )}
      </Modal>
    </div>
  )
}

export default TransactionWorkspace
