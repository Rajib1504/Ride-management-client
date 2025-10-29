import type { ComponentType } from "react"

export interface ISidebar {
title: string,
items:{
      title:string,
      url:string,
      Component: ComponentType
}[]
}