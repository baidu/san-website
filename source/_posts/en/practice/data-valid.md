---
title: What Content is Suitable for the Data?
categories:
- practice
---


The introduction of san says: "San is a MVVM component framework. With the help of san view engine, one can focus on the data only and views will be updated automatically." We're going to discuss the "data" to be manipulated. The contents of the "data" are expected to be view related states only.

#### Sources of the Data

For a component, the source of the data can be:

1. Data defined by the component itself;
2. Data passed in from the parent component;
3. Data defined by the computed property.

All of the above data can be accessed by `this.data.get()` method.

The data defined by the component itself can be modified directly to update the view of the component and it's descendant components. The data passed in from the parent component are usually for read purposes only. Though we can also change these data in child components, the better practice is to change it in the component where the data is initially created.

#### Contents of the Data

The entries in the data can be of primitive types like String, Number, Array, plain Objects. Other objects like regular expressions and functions are not expected to be part of the data and can be imported or implemented inside the component instead. There's an exception when we need to pass objects to the child components, such as passing custom form validation functions to the child components.

