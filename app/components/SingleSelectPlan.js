import React, { useEffect, useState, useContext } from "react";
import Select from "react-select";
import axios from "axios";
import { toast } from "react-toastify";

export default function SingleSelectPlan({
  disabled,
  setFieldValue,
  values,
  fieldName,
  App_Acronym,
  mode,
  defaultValue,
}) {
  const [planOptions, setPlanOptions] = useState();

  ///////////////////////////////////////////////////////////
  // 2 layers of filter for disable
  // 1. Disabled param = isPermit, allow create task and edit task (open and edit state)
  // 2. isChangePlan param is used by checkbox to enable or disable plan
  ///////////////////////////////////////////////////////////
  let isChangePlan = false;
  if (mode === "editDoneTask") {
    isChangePlan = values.changePlan ? false : true;
  }

  ////////////////////////////////////////////////////////
  /* Triggered when you select an option. 
  param selectedValue is the option selected, which comes in the form {value: "a", label;"a"}, field value is string
  */
  ///////////////////////////////////////////////////////////
  const onChangeHandler = (selectedValues) => {
    setFieldValue(fieldName, selectedValues.value);
  };

  //////////////////////////////////////////////////////
  // Takes in {value: "a", label;"a"}
  //////////////////////////////////////////////////////
  const getValue = () => {
    let fieldVal = "";

    if (planOptions) {
      console.log("getVal values[fieldName]", values[fieldName]);
      fieldVal = planOptions.filter((option) => {
        return option.value === values[fieldName];
      });
      // faulty default value that doesn't register value when submit
      //if (values[fieldName] !== "") {
      // fieldVal = setPlanOptions.filter((option) => {
      //   return option.value === values[fieldName];
      // });
      // } else {
      //   fieldVal = defaultValue;
      // }
    }
    return fieldVal;
  };

  // Fetch plan name to populate as options
  useEffect(() => {
    const fetchAllPlan = async () => {
      const token = localStorage.getItem("token");

      if (App_Acronym) {
        try {
          const params = { Plan_app_Acronym: App_Acronym };
          const resAllPlans = await axios.post(
            "http://localhost:8080/plans/acronym",
            params,
            {
              headers: { Authorization: `Basic ${token}` },
            }
          );
          if (resAllPlans.data.length > 0) {
            let planArr = [];

            resAllPlans.data.forEach((plan) => {
              let planObj = {
                value: plan.Plan_MVP_name,
                label: plan.Plan_MVP_name,
              };
              planArr.push(planObj);
            });
            setPlanOptions(planArr);
            values[fieldName] =
              values[fieldName] === "" ? defaultValue.value : values[fieldName];
          } else {
            // toast.error("No Plan found");
            console.log("No Plan found");
          }
        } catch (error) {
          console.log("Unable to retrieve plan", error);
          // toast.error(
          //   "Unable to retrieve plan, " + error?.response?.data
          // );
        }
      }
    };
    fetchAllPlan();
  }, []);

  return (
    <Select
      isDisabled={disabled || isChangePlan}
      options={planOptions}
      value={getValue()}
      onChange={onChangeHandler}
      // defaultValue={defaultValue}
    />
  );
}
