<script setup lang="ts">
  import { defineProps, watch, ref } from 'vue'
  import { ElRow, ElCol, ElInput, ElTree } from 'element-plus'
  import { userService } from '~/services'
  import { useI18n } from 'vue-i18n'
  import { ILeasingCompanyEmployees } from '~/types'
  // TODO: debounce for description
  // TODO: Move Node
  const { t } = useI18n()
  const id = ref<string>()
  const employees = ref<ILeasingCompanyEmployees>()

  interface Tree {
    id: string
    label: string
    children?: Tree[]
  }

  const fillDataSource = () => {
    console.log(employees.value?.sales.regions.length)
    dataSource.value = employees.value?.sales.regions.map((region) => {
      console.log('region', region)
      const node: Tree = {
        id: region.id,
        label: `${region.name} (${region.headOfDepartment})`,
        children: [],
      }
      region.employees.forEach((employee) =>
        node.children?.push({
          id: employee.id,
          label: employee.firstName + employee.lastName + employee.patronymic,
        })
      )
      return node
    })
  }
  const dataSource = ref<Tree[]>()
  const props = defineProps<{
    companyId: string
  }>()
  watch(
    () => props.companyId,
    async (newVal) => {
      if (newVal) {
        id.value = newVal
        employees.value = await userService.getLeasingCompanyEmployees(id.value)
        fillDataSource()
      }
      console.log(`value is: ${newVal}`)
    },
    { immediate: true }
  )
</script>

<template>
  <el-row v-if="false">
    <el-col>
      {{ t('loading') }}
    </el-col>
  </el-row>
  <el-row>
    <el-col>
      {{ t('analitics.headOfDepartment') }}
      <el-input
        disabled
        :model-value="employees?.analitics.headOfDepartment"
      ></el-input>
    </el-col>
  </el-row>
  <el-row>
    <el-col>
      {{ t('analitics.employees') }}
      <el-input
        v-for="employee in employees?.analitics.employees"
        :key="employee.id"
        disabled
        :model-value="
          employee.firstName + employee.lastName + employee.patronymic
        "
      ></el-input>
    </el-col>
  </el-row>
  <el-row>
    <el-col>
      {{ t('sales.headOfDepartment') }}
      <el-input
        disabled
        :model-value="employees?.sales.headOfDepartment"
      ></el-input>
    </el-col>
  </el-row>
  <el-row>
    <el-col>
      <el-tree
        :data="dataSource"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
      >
        <template #default="{ node }">
          <span class="custom-tree-node">
            <span>{{ node.label }}</span>
          </span>
        </template>
      </el-tree>
    </el-col>
  </el-row>
  <!-- <el-row>
    <el-col>
      {{ t('sales.regions.managers') }}
      <div v-for="region in employees?.sales.regions" :key="region.id">
        {{ region.name }} ({{ region.headOfDepartment }})
        <div v-for="employee in region.employees" :key="employee.id">
          {{ employee.fio }}
        </div>
      </div>
    </el-col>
  </el-row> -->
</template>
