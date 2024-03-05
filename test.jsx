import React, { useEffect } from "react"
import { useForm, useFieldArray, Controller } from "react-hook-form"
import ReactDOM from "react-dom"
import Select from "react-select"

import "./styles.css"

const apiData = {
  username: "test",
  itemsFilled: [
    { id: "3", name: "knife", count: 1 },
    { id: "4", name: "shoe s", count: 0 },
    { id: "8", name: "mask s", count: 2 },
    { id: "10", name: "table s", count: 0 },
    { id: "201", name: "marker", count: 3 },
  ],
}

const defaultOptions = [
  {
    label: "pen",
    value: "101",
  },
  {
    label: "marker",
    value: "201",
  },
  {
    label: "mouse",
    value: "301",
  },
  {
    label: "sunglass",
    value: "401",
  },
]

function App() {
  const { register, control, handleSubmit, formState, setValue } = useForm({
    defaultValues: {
      username: "",
      test: [
        {
          item_count: "",
          item_select: { value: "3", label: "knife" },
          canDelete: false,
          options: [],
        },
        {
          item_count: "",
          item_select: { value: "4", label: "shoe s" },
          canDelete: false,
          options: [
            {
              label: "shoe s",
              value: "4",
            },
            {
              label: "shoe m",
              value: "41",
            },
            {
              label: "shoe l",
              value: "42",
            },
            {
              label: "shoe xl",
              value: "43",
            },
          ],
        },
        {
          item_count: "",
          item_select: { value: "8", label: "mask s" },
          canDelete: false,
          options: [
            {
              label: "mask s",
              value: "8",
            },
            {
              label: "mask m",
              value: "81",
            },
            {
              label: "mask l",
              value: "82",
            },
            {
              label: "mask xl",
              value: "83",
            },
          ],
        },
        {
          item_count: "",
          item_select: { value: "10", label: "table s" },
          canDelete: false,
          options: [
            {
              label: "table s",
              value: "10",
            },
            {
              label: "table m",
              value: "101",
            },
            {
              label: "table l",
              value: "102",
            },
            {
              label: "table xl",
              value: "103",
            },
          ],
        },
      ],
    },
  })
  const { fields, append, remove } = useFieldArray({
    control,
    name: "test",
  })

  useEffect(() => {
    // assume this data is coming from api
    setTimeout(() => {
      const { username, itemsFilled } = apiData
      setValue("username", username)
      if (itemsFilled?.length) {
        itemsFilled.forEach((item, index) => {
          append({
            item_count: item.count,
            item_select: {
              value: item.id,
              label: item.name,
            },
            canDelete: true,
          })
          setValue(`test[${index}].item_select`, {
            value: item.id,
            label: item.name,
          })
          setValue(`test[${index}].item_count`, item.count)
        })
      }
    }, 1000)
  }, [setValue, append])

  const onSubmit = (data) => console.log("data", data)

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <label>Username</label>
      <input name="username" ref={register} />
      <ul>
        {fields.map(
          ({ id, item_count, item_select, canDelete, options }, index) => {
            return (
              <li key={id}>
                <Controller
                  as={Select}
                  name={`test[${index}].item_select`}
                  control={control}
                  defaultValue={item_select}
                  options={options || defaultOptions}
                />
                <input
                  type="number"
                  min="0"
                  name={`test[${index}].item_count`}
                  defaultValue={item_count}
                  ref={register}
                />

                {canDelete && (
                  <button
                    type="button"
                    onClick={() => {
                      remove(index)
                    }}
                  >
                    Delete
                  </button>
                )}
              </li>
            )
          }
        )}
      </ul>
      <section>
        <button
          type="button"
          onClick={() => {
            append({ item_count: "", item_select: "", canDelete: true })
          }}
        >
          append
        </button>
      </section>
      <p>formState is Dirty:{formState.isDirty ? "Yep" : "Nope"}</p>
      <input type="submit" disabled={!formState.isDirty} />
    </form>
  )
}

const rootElement = document.getElementById("root")
ReactDOM.render(<App />, rootElement)
