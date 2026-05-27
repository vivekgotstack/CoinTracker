import { useState } from 'react'
import { Button, Form, Input, Modal, Popconfirm, Select, Space, Table, Tag, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { Edit3, Plus, Tags, Trash2 } from 'lucide-react'
import EmptyState from '@/components/shared/EmptyState'
import EmojiField from '@/components/ui/EmojiField'
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from '@/hooks/UseCategories'
import { getApiErrorMessage } from '@/lib/errors'
import { formatDate } from '@/lib/format'
import { normalizeEmojiIcon, renderEntityIcon } from '@/lib/icons'
import type { Category, CategoryRequest } from '@/types/category'
import { useUserPreferences } from '@/contexts/UserPreferencesContext'

const typeOptions = [
  { label: 'Income', value: 'INCOME' },
  { label: 'Expense', value: 'EXPENSE' },
]

const CategoryPage = () => {
  const [form] = Form.useForm<CategoryRequest>()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState<Category | null>(null)

  const categories = useCategories()
  const createMutation = useCreateCategory()
  const updateMutation = useUpdateCategory()
  const deleteMutation = useDeleteCategory()
  const { preferences } = useUserPreferences()

  const openCreate = () => {
    setEditing(null)
    form.setFieldsValue({ name: '', type: 'EXPENSE', icon: '' })
    setOpen(true)
  }

  const openEdit = (category: Category) => {
    setEditing(category)
    form.setFieldsValue({
      name: category.name,
      type: category.type,
      icon: normalizeEmojiIcon(category.icon),
    })
    setOpen(true)
  }

  const handleSubmit = async (values: CategoryRequest) => {
    const payload = {
      ...values,
      name: values.name.trim(),
      icon: normalizeEmojiIcon(values.icon),
    }

    try {
      if (editing) {
        await updateMutation.mutateAsync({ id: editing.id, payload })
        message.success('Category updated')
      } else {
        await createMutation.mutateAsync(payload)
        message.success('Category created')
      }

      setOpen(false)
      form.resetFields()
    } catch (error) {
      message.error(getApiErrorMessage(error, 'Unable to save category'))
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id)
      message.success('Category deleted')
    } catch (error) {
      const apiMessage = getApiErrorMessage(error, 'Unable to delete category')
      message.error(
        apiMessage.toLowerCase().includes('constraint')
          ? 'This category is linked to transactions. Delete or move those transactions first.'
          : apiMessage
      )
    }
  }

  const columns: ColumnsType<Category> = [
    {
      title: 'Category',
      dataIndex: 'name',
      render: (_, category) => (
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-muted)] text-xl">
            {renderEntityIcon(category.icon, category.type === 'INCOME' ? '\u{1F4B0}' : '\u{1F9FE}')}
          </span>
          <div>
            <p className="font-medium text-[var(--foreground)]">{category.name}</p>
            <p className="text-sm text-[var(--muted)]">Created {formatDate(category.createdAt)}</p>
          </div>
        </div>
      ),
    },
    {
      title: 'Type',
      dataIndex: 'type',
      render: (type: Category['type']) => <Tag color={type === 'INCOME' ? 'green' : 'red'}>{type}</Tag>,
    },
    {
      title: 'Updated',
      dataIndex: 'updatedAt',
      render: (date: string) => formatDate(date),
    },
    {
      title: '',
      key: 'actions',
      align: 'right',
      render: (_, category) => (
        <Space>
          <Button icon={<Edit3 size={15} />} onClick={() => openEdit(category)} />
          <Popconfirm title="Delete category?" onConfirm={() => handleDelete(category.id)}>
            <Button danger icon={<Trash2 size={15} />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="space-y-12">
      <section className="mb-3 flex flex-col gap-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="brand-font text-3xl font-bold text-[var(--foreground)]">Categories</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">
            Build a clean money language for income, bills, shopping, savings, and everything between.
          </p>
        </div>

        <Button type="primary" icon={<Plus size={16} />} onClick={openCreate} className="mt-2 sm:mt-0">
          Add category
        </Button>
      </section>

      <section className="glass-panel rounded-2xl p-4 sm:p-7">
        {(categories.data?.length ?? 0) > 0 ? (
          <Table<Category>
            rowKey="id"
            columns={columns}
            dataSource={categories.data}
            loading={categories.isLoading}
            size={preferences.compactTables ? 'small' : 'middle'}
            scroll={{ x: 720 }}
            className="overflow-hidden rounded-2xl"
            pagination={{ pageSize: 8 }}
          />
        ) : (
          <EmptyState
            icon={<Tags size={22} />}
            title="No categories yet"
            description="Create income and expense categories so transactions can be attached correctly."
          />
        )}
      </section>

      <Modal
        title={editing ? 'Edit category' : 'Add category'}
        open={open}
        onCancel={() => setOpen(false)}
        footer={null}
        destroyOnHidden
        centered
      >
        <Form<CategoryRequest> form={form} layout="vertical" onFinish={handleSubmit} requiredMark={false}>
          <Form.Item label="Name" name="name" rules={[{ required: true, message: 'Name is required' }]}>
            <Input placeholder="Groceries, salary, rent..." />
          </Form.Item>

          <Form.Item label="Type" name="type" rules={[{ required: true, message: 'Type is required' }]}>
            <Select options={typeOptions} />
          </Form.Item>

          <Form.Item label="Icon" name="icon">
            <EmojiField fallback={'\u{1F3F7}\u{FE0F}'} />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            block
            className="mt-2"
            loading={createMutation.isPending || updateMutation.isPending}
          >
            Save category
          </Button>
        </Form>
      </Modal>
    </div>
  )
}

export default CategoryPage
