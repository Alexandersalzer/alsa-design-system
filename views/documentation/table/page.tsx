"use client";

import React, { useState } from 'react';
import { Box, Body, IndexTable, Button, Icon, Tag } from '../../../design/index';
import { ComponentDocPage } from '../../documentation-components/ComponentDocPage';
import { TrashIcon, PencilIcon, EyeIcon } from '@heroicons/react/24/outline';

export default function TablePage() {
  // Sample data
  const sampleUsers = [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User', status: 'active' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'User', status: 'inactive' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'Manager', status: 'active' },
  ];

  const sampleProducts = [
    { id: 1, name: 'Product A', price: 29.99, stock: 50, category: 'Electronics' },
    { id: 2, name: 'Product B', price: 49.99, stock: 25, category: 'Clothing' },
    { id: 3, name: 'Product C', price: 19.99, stock: 100, category: 'Books' },
    { id: 4, name: 'Product D', price: 99.99, stock: 10, category: 'Electronics' },
    { id: 5, name: 'Product E', price: 14.99, stock: 75, category: 'Books' },
  ];

  // State for selection example
  const [selectedUsers, setSelectedUsers] = useState<(string | number)[]>([]);

  // State for pagination example
  const [currentPage, setCurrentPage] = useState(1);

  // Basic columns
  const userColumns = [
    {
      key: 'name',
      title: 'Name',
      render: (user: any) => <Body weight="medium">{user.name}</Body>,
      sortable: true,
      sortFn: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      key: 'email',
      title: 'Email',
      render: (user: any) => <Body color="secondary">{user.email}</Body>,
    },
    {
      key: 'role',
      title: 'Role',
      render: (user: any) => <Body>{user.role}</Body>,
      align: 'center' as const,
    },
    {
      key: 'status',
      title: 'Status',
      render: (user: any) => (
        <Tag variant={user.status === 'active' ? 'success' : 'warning'}>
          {user.status}
        </Tag>
      ),
      align: 'center' as const,
    },
  ];

  // Product columns with sorting
  const productColumns = [
    {
      key: 'name',
      title: 'Product Name',
      render: (product: any) => <Body weight="medium">{product.name}</Body>,
      sortable: true,
      sortFn: (a: any, b: any) => a.name.localeCompare(b.name),
    },
    {
      key: 'price',
      title: 'Price',
      render: (product: any) => <Body>${product.price.toFixed(2)}</Body>,
      align: 'right' as const,
      sortable: true,
      sortFn: (a: any, b: any) => a.price - b.price,
    },
    {
      key: 'stock',
      title: 'Stock',
      render: (product: any) => <Body>{product.stock}</Body>,
      align: 'right' as const,
      sortable: true,
      sortFn: (a: any, b: any) => a.stock - b.stock,
    },
    {
      key: 'category',
      title: 'Category',
      render: (product: any) => <Body color="secondary">{product.category}</Body>,
    },
  ];

  // Columns with actions
  const actionColumns = [
    ...userColumns.slice(0, 3),
    {
      key: 'actions',
      title: 'Actions',
      render: (user: any) => (
        <Box display="flex" gap="xs">
          <Button size="sm" variant="ghost" leftIcon={<Icon size="sm"><EyeIcon /></Icon>} aria-label="Visa">Visa</Button>
          <Button size="sm" variant="ghost" leftIcon={<Icon size="sm"><PencilIcon /></Icon>} aria-label="Redigera">Redigera</Button>
          <Button size="sm" variant="ghost" leftIcon={<Icon size="sm"><TrashIcon /></Icon>} aria-label="Radera">Radera</Button>
        </Box>
      ),
      align: 'right' as const,
    },
  ];

  return (
    <ComponentDocPage
      componentName="IndexTable"
      description="Advanced data table with selection, sorting, pagination, and bulk actions for managing lists of items"
      importStatement={`import { IndexTable } from '../../../design/index'`}
      sections={[
        {
          title: 'Basic Usage',
          description: 'Simple table with columns and data',
          preview: (
            <Box>
              <IndexTable
                items={sampleUsers}
                columns={userColumns}
                resourceName={{ singular: 'user', plural: 'users' }}
              />
            </Box>
          ),
          code: `const columns = [
  {
    key: 'name',
    title: 'Name',
    render: (user) => <Body weight="medium">{user.name}</Body>,
  },
  {
    key: 'email',
    title: 'Email',
    render: (user) => <Body color="secondary">{user.email}</Body>,
  },
  {
    key: 'role',
    title: 'Role',
    render: (user) => <Body>{user.role}</Body>,
  },
];

<IndexTable
  items={users}
  columns={columns}
  resourceName={{ singular: 'user', plural: 'users' }}
/>`,
        },

        {
          title: 'With Selection',
          description: 'Enable row selection with checkboxes',
          preview: (
            <Box>
              <IndexTable
                items={sampleUsers}
                columns={userColumns}
                selectable
                selectedItems={selectedUsers}
                onSelectionChange={setSelectedUsers}
                resourceName={{ singular: 'user', plural: 'users' }}
              />
            </Box>
          ),
          code: `const [selectedUsers, setSelectedUsers] = useState([]);

<IndexTable
  items={users}
  columns={columns}
  selectable
  selectedItems={selectedUsers}
  onSelectionChange={setSelectedUsers}
  resourceName={{ singular: 'user', plural: 'users' }}
/>`,
        },

        {
          title: 'With Bulk Actions',
          description: 'Show action bar when items are selected',
          preview: (
            <Box>
              <IndexTable
                items={sampleUsers}
                columns={userColumns}
                selectable
                selectedItems={selectedUsers}
                onSelectionChange={setSelectedUsers}
                bulkActions={
                  <>
                    <Button size="sm" variant="accent">Export</Button>
                    <Button size="sm" variant="ghost">Edit</Button>
                    <Button size="sm" variant="destructive">Delete</Button>
                  </>
                }
                resourceName={{ singular: 'user', plural: 'users' }}
              />
            </Box>
          ),
          code: `<IndexTable
  items={users}
  columns={columns}
  selectable
  selectedItems={selectedUsers}
  onSelectionChange={setSelectedUsers}
  bulkActions={
    <>
      <Button size="sm" variant="accent">Export</Button>
      <Button size="sm" variant="ghost">Edit</Button>
      <Button size="sm" variant="destructive">Delete</Button>
    </>
  }
  resourceName={{ singular: 'user', plural: 'users' }}
/>`,
        },

        {
          title: 'Sortable Columns',
          description: 'Enable column sorting',
          preview: (
            <Box>
              <IndexTable
                items={sampleProducts}
                columns={productColumns}
                sortable
                defaultSortColumn="name"
                defaultSortDirection="asc"
                resourceName={{ singular: 'product', plural: 'products' }}
              />
            </Box>
          ),
          code: `const columns = [
  {
    key: 'name',
    title: 'Product Name',
    render: (product) => <Body weight="medium">{product.name}</Body>,
    sortable: true,
    sortFn: (a, b) => a.name.localeCompare(b.name),
  },
  {
    key: 'price',
    title: 'Price',
    render: (product) => <Body>\${product.price.toFixed(2)}</Body>,
    sortable: true,
    sortFn: (a, b) => a.price - b.price,
  },
];

<IndexTable
  items={products}
  columns={columns}
  sortable
  defaultSortColumn="name"
  defaultSortDirection="asc"
  resourceName={{ singular: 'product', plural: 'products' }}
/>`,
        },

        {
          title: 'With Pagination',
          description: 'Add pagination controls',
          preview: (
            <Box>
              <IndexTable
                items={sampleProducts}
                columns={productColumns}
                pagination
                currentPage={currentPage}
                totalPages={3}
                totalItems={15}
                pageSize={5}
                onPageChange={setCurrentPage}
                resourceName={{ singular: 'product', plural: 'products' }}
              />
            </Box>
          ),
          code: `const [currentPage, setCurrentPage] = useState(1);

<IndexTable
  items={products}
  columns={columns}
  pagination
  currentPage={currentPage}
  totalPages={3}
  totalItems={15}
  pageSize={5}
  onPageChange={setCurrentPage}
  resourceName={{ singular: 'product', plural: 'products' }}
/>`,
        },

        {
          title: 'With Row Actions',
          description: 'Add action buttons to each row',
          preview: (
            <Box>
              <IndexTable
                items={sampleUsers}
                columns={actionColumns}
                resourceName={{ singular: 'user', plural: 'users' }}
              />
            </Box>
          ),
          code: `const columns = [
  // ... other columns
  {
    key: 'actions',
    title: 'Actions',
    render: (user) => (
      <Box display="flex" gap="xs">
        <Button size="sm" variant="ghost">
          <Icon size="sm"><EyeIcon /></Icon>
        </Button>
        <Button size="sm" variant="ghost">
          <Icon size="sm"><PencilIcon /></Icon>
        </Button>
        <Button size="sm" variant="ghost">
          <Icon size="sm"><TrashIcon /></Icon>
        </Button>
      </Box>
    ),
    align: 'right',
  },
];`,
        },

        {
          title: 'Clickable Rows',
          description: 'Handle row clicks for navigation',
          preview: (
            <Box>
              <IndexTable
                items={sampleUsers}
                columns={userColumns}
                onRowClick={(user) => alert(`Clicked on ${user.name}`)}
                resourceName={{ singular: 'user', plural: 'users' }}
              />
            </Box>
          ),
          code: `<IndexTable
  items={users}
  columns={columns}
  onRowClick={(user) => router.push(\`/users/\${user.id}\`)}
  resourceName={{ singular: 'user', plural: 'users' }}
/>`,
        },

        {
          title: 'Table Variants',
          description: 'Different visual styles',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1">
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Body size="xs" color="secondary" weight="semibold">Default</Body>
                  <IndexTable
                    items={sampleUsers.slice(0, 3)}
                    columns={userColumns}
                    variant="default"
                    resourceName={{ singular: 'user', plural: 'users' }}
                  />
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Body size="xs" color="secondary" weight="semibold">Bordered</Body>
                  <IndexTable
                    items={sampleUsers.slice(0, 3)}
                    columns={userColumns}
                    variant="bordered"
                    resourceName={{ singular: 'user', plural: 'users' }}
                  />
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Body size="xs" color="secondary" weight="semibold">Striped</Body>
                  <IndexTable
                    items={sampleUsers.slice(0, 3)}
                    columns={userColumns}
                    variant="striped"
                    resourceName={{ singular: 'user', plural: 'users' }}
                  />
                </Box>
              </Box>
            </Box>
          ),
          code: `<IndexTable variant="default" items={items} columns={columns} />

<IndexTable variant="bordered" items={items} columns={columns} />

<IndexTable variant="striped" items={items} columns={columns} />`        },

        {
          title: 'Table Sizes',
          description: 'Control table density',
          preview: (
            <Box display="grid" gap="md" className="grid-cols-1">
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Body size="xs" color="secondary" weight="semibold">Small</Body>
                  <IndexTable
                    items={sampleUsers.slice(0, 2)}
                    columns={userColumns}
                    size="sm"
                    resourceName={{ singular: 'user', plural: 'users' }}
                  />
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Body size="xs" color="secondary" weight="semibold">Medium (default)</Body>
                  <IndexTable
                    items={sampleUsers.slice(0, 2)}
                    columns={userColumns}
                    size="md"
                    resourceName={{ singular: 'user', plural: 'users' }}
                  />
                </Box>
              </Box>
              <Box>
                <Box display="flex" direction="column" gap="sm">
                  <Body size="xs" color="secondary" weight="semibold">Large</Body>
                  <IndexTable
                    items={sampleUsers.slice(0, 2)}
                    columns={userColumns}
                    size="lg"
                    resourceName={{ singular: 'user', plural: 'users' }}
                  />
                </Box>
              </Box>
            </Box>
          ),
          code: `<IndexTable size="sm" items={items} columns={columns} />

<IndexTable size="md" items={items} columns={columns} />

<IndexTable size="lg" items={items} columns={columns} />`        },

        {
          title: 'Empty State',
          description: 'Custom empty state message',
          preview: (
            <Box>
              <IndexTable
                items={[]}
                columns={userColumns}
                emptyState={
                  <Box display="flex" direction="column" gap="sm" align="center" padding="xl">
                    <Body size="lg" weight="semibold">No users found</Body>
                    <Body color="secondary">Try adjusting your filters or create a new user</Body>
                    <Button size="sm" variant="accent">Create User</Button>
                  </Box>
                }
                resourceName={{ singular: 'user', plural: 'users' }}
              />
            </Box>
          ),
          code: `<IndexTable
  items={[]}
  columns={columns}
  emptyState={
    <Box display="flex" direction="column" gap="sm" align="center">
      <Body size="lg" weight="semibold">No users found</Body>
      <Body color="secondary">Try adjusting your filters</Body>
      <Button size="sm" variant="accent">Create User</Button>
    </Box>
  }
  resourceName={{ singular: 'user', plural: 'users' }}
/>`,
        },
      ]}
    >
      <Box display="flex" direction="column" gap="md">
        <Box>
          <Body color="secondary" size="md">
            <strong>Best Practices:</strong> Use IndexTable for data-heavy interfaces where users need
            to browse, select, and take action on multiple items. Enable sorting for large datasets,
            and use pagination to improve performance. The bulk action bar appears automatically when
            items are selected.
          </Body>
        </Box>
        <Box>
          <Body color="secondary" size="md">
            <strong>Column Configuration:</strong> Each column requires a <code>key</code>, <code>title</code>,
            and <code>render</code> function. Set <code>sortable: true</code> and provide a <code>sortFn</code>
            to enable sorting. Use <code>align</code> for text alignment and <code>hideOnMobile</code> to hide
            columns on small screens.
          </Body>
        </Box>
      </Box>
    </ComponentDocPage>
  );
}
