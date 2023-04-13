import React from "react";
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import { Button, Paper, TextField, Typography } from "@mui/material";
import { Controller, useForm } from "react-hook-form";

const steps = [
    "Group information",
    "Add members",
    "Attach policy",
];


export default function CreateGroupStepper() {

    const [activeStep, setActiveStep] = React.useState(0);

    const {
        register,
        control,
        handleSubmit,
        watch,
        setValue,
        formState: { errors },
        reset,
        getValues,
    } = useForm({
        defaultValues: {
            members: [
                {
                    address: "",
                    weight: 0,
                    metadata: "",
                },
            ],
            policyMetadata: {
                metadata: "",
                decisionPolicy: "threshold",
                percentage: 0,
                threshold: 0,
            },
        },
    });

    const onSubmit = (data) => {
        console.log(data);
    }

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep} alternativeLabel >
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>
            {
                activeStep === 0 ?
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <Paper elevation={0}
                            sx={{
                                p: 4,
                            }}
                        >
                            <div>
                            {JSON.stringify(errors)}
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{ required: "Name is required", maxLength: 25 }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="Group name"
                                            multiline
                                            size="small"
                                            name="Group name"
                                            fullWidth
                                            sx={{
                                                mb:2,
                                            }}
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    name="description"
                                    control={control}
                                    rules={{ required: "Description is required", maxLength: 60 }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="Group description"
                                            multiline
                                            size="small"
                                            name="Group description"
                                            fullWidth
                                            sx={{
                                                mb:2,
                                            }}
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    name="website"
                                    control={control}
                                    rules={{ required: "Website is required", maxLength: 50 }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="Group website"
                                            multiline
                                            size="small"
                                            name="Group website"
                                            fullWidth
                                            sx={{
                                                mb:2,
                                            }}
                                        />
                                    )}
                                />
                            </div>
                            <div>
                                <Controller
                                    name="forumUrl"
                                    control={control}
                                    rules={{ required: "Forum url is required", maxLength: 50 }}
                                    render={({ field }) => (
                                        <TextField
                                            {...field}
                                            required
                                            label="Group forum"
                                            multiline
                                            size="small"
                                            name="Group forum"
                                            fullWidth
                                            sx={{
                                                mb:2,
                                            }}
                                        />
                                    )}
                                />
                            </div>
                            <Button
                                type="submit"
                            >
                                Next
                            </Button>
                        </Paper>
                    </form>
                    :
                    <></>
            }
            <Button
                onClick={() => setActiveStep(activeStep === 2 ? 0 : activeStep + 1)}
            >Next</Button>
        </Box>
    );
}