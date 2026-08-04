"use client";

import { useState } from "react";
import {
  CircleUserRoundIcon,
  CreditCardIcon,
  LayoutDashboardIcon,
  ReceiptTextIcon,
  Settings2Icon,
  SlidersHorizontalIcon,
  UserRoundIcon,
  WalletCardsIcon,
} from "lucide-react";

import {
  ClipPathTabs,
  ClipPathTabsContent,
  type ClipPathTabsItem,
} from "@/components/qiuye-ui/clip-path-tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ViewSourceButton } from "@/components/view-source-button";

const sourceCodes = {
  default: `import { useState } from "react";
import {
  ClipPathTabs,
  ClipPathTabsContent,
} from "@/components/qiuye-ui/clip-path-tabs";

export function Demo() {
  const [value, setValue] = useState("balance");

  return (
    <ClipPathTabs
      ariaLabel="账户视图"
      value={value}
      onValueChange={setValue}
      items={[
        { value: "payments", label: "支付" },
        { value: "balance", label: "余额" },
        { value: "customers", label: "客户" },
        { value: "billing", label: "账单" },
      ]}
    >
      <ClipPathTabsContent value="balance">余额内容</ClipPathTabsContent>
    </ClipPathTabs>
  );
}`,
  rounded: `<ClipPathTabs
  ariaLabel="工作区视图"
  shape="rounded"
  cornerRadius={10}
  fullWidth
  inactiveBackground="var(--muted)"
  inactiveForeground="var(--muted-foreground)"
  activeBackground="#2563eb"
  activeForeground="#ffffff"
  items={items}
/>`,
  states: `<ClipPathTabs
  ariaLabel="设置视图"
  defaultValue="general"
  size="sm"
  inactiveBackground="var(--background)"
  activeBackground="#e5484d"
  activeForeground="#ffffff"
  items={[
    { value: "general", label: "通用" },
    { value: "account", label: "账户" },
    { value: "advanced", label: "高级", disabled: true },
  ]}
/>`,
  segmented: `<ClipPathTabs
  ariaLabel="分段过渡示例"
  defaultValue="payments"
  transitionMode="segmented"
  items={items}
/>`,
};

const accountItems: ClipPathTabsItem[] = [
  { value: "payments", label: "支付", icon: <CreditCardIcon /> },
  { value: "balance", label: "余额", icon: <WalletCardsIcon /> },
  { value: "customers", label: "客户", icon: <UserRoundIcon /> },
  { value: "billing", label: "账单", icon: <ReceiptTextIcon /> },
];

const workspaceItems: ClipPathTabsItem[] = [
  { value: "overview", label: "概览", icon: <LayoutDashboardIcon /> },
  { value: "preferences", label: "偏好", icon: <SlidersHorizontalIcon /> },
  { value: "profile", label: "资料", icon: <CircleUserRoundIcon /> },
];

const settingsItems: ClipPathTabsItem[] = [
  { value: "general", label: "通用", icon: <Settings2Icon /> },
  { value: "account", label: "账户", icon: <CircleUserRoundIcon /> },
  { value: "advanced", label: "高级", disabled: true },
];

export function ClipPathTabsDemo() {
  const [accountView, setAccountView] = useState("balance");
  const [workspaceView, setWorkspaceView] = useState("overview");

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>默认胶囊</CardTitle>
            <ViewSourceButton
              code={sourceCodes.default}
              title="默认胶囊 - 源码"
            />
          </div>
        </CardHeader>
        <CardContent>
          <ClipPathTabs
            ariaLabel="账户视图"
            value={accountView}
            onValueChange={setAccountView}
            items={accountItems}
            className="max-w-full"
          >
            {accountItems.map((item) => (
              <ClipPathTabsContent
                key={item.value}
                value={item.value}
                className="mt-4 rounded-md border bg-muted/25 p-4 text-sm"
              >
                当前视图：{item.label}
              </ClipPathTabsContent>
            ))}
          </ClipPathTabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>保留间隙的分段过渡</CardTitle>
            <ViewSourceButton
              code={sourceCodes.segmented}
              title="分段过渡 - 源码"
            />
          </div>
        </CardHeader>
        <CardContent>
          <ClipPathTabs
            ariaLabel="分段过渡示例"
            defaultValue="payments"
            transitionMode="segmented"
            items={accountItems}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>圆角矩形与自定义配色</CardTitle>
            <ViewSourceButton
              code={sourceCodes.rounded}
              title="圆角矩形 - 源码"
            />
          </div>
        </CardHeader>
        <CardContent>
          <ClipPathTabs
            ariaLabel="工作区视图"
            shape="rounded"
            cornerRadius={10}
            fullWidth
            value={workspaceView}
            onValueChange={setWorkspaceView}
            inactiveBackground="var(--muted)"
            inactiveForeground="var(--muted-foreground)"
            activeBackground="#2563eb"
            activeForeground="#ffffff"
            items={workspaceItems}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <CardTitle>普通态底色与禁用项</CardTitle>
            <ViewSourceButton
              code={sourceCodes.states}
              title="普通态底色与禁用项 - 源码"
            />
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap items-center gap-4 rounded-md bg-muted/50 p-3">
            <ClipPathTabs
              ariaLabel="设置视图"
              defaultValue="general"
              size="sm"
              inactiveBackground="var(--background)"
              activeBackground="#e5484d"
              activeForeground="#ffffff"
              items={settingsItems}
            />
            <Badge variant="outline">高级不可用</Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
