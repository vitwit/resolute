import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import CreateMultisig from './multisig/CreateMultisig';
import CreateTxn from './multisig/CreateTxn';
import BroadcastTx from './multisig/BroadcastTx';
import SignTxn from './multisig/SignTxn';
import './common.css';
import Tx_index from './multisig/tx/Tx_index';

const steps = ['Create/Select Multisig', 'Create/Sign/Broadcast Transaction'];

export default function MultiSig() {
    const [activeStep, setActiveStep] = React.useState(0);

    const isStepOptional = (step) => {
        return step === -1;
    };


    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Stepper activeStep={activeStep}>
                {steps.map((label, index) => {
                    const stepProps = {};
                    const labelProps = {};
                    if (isStepOptional(index)) {
                        labelProps.optional = (
                            <Typography variant="caption">Optional</Typography>
                        );
                    }
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel {...labelProps}>{label}</StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            {activeStep === steps.length ? (
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        All steps completed - you&apos;re finished
                    </Typography>
                    <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
                        <Box sx={{ flex: '1 1 auto' }} />
                        <Button onClick={handleReset}>Reset</Button>
                    </Box>
                </React.Fragment>
            ) : (
                <Box sx={{ mt: 4 }}>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        {
                            activeStep === 0 ? <CreateMultisig handleNext={handleNext} /> : null
                        }
                        {
                            activeStep === 1 ? <Tx_index handleBack={handleBack} handleNext={handleNext} /> : null
                        }
                    </Typography>
                </Box>
            )}
        </Box>
    );
}
