import {createMachine,assign} from 'xstate';

export const myMachine = createMachine({
    id:"tool",
    initial : "idle",
    context : {
        selectedTool : null,
        isMeasureValueWarning : false,
        isMeasureValueDisplayed : false
    },
    states :
    {
        idle : {
            entry: ()=>{console.log("Idle")},
            on:{
                SELECT_TOOL : [{
                    target :"active.measure",
                    actions : assign((context)=>{
                        console.log(context)
                        return {selectedTool : context.event.tool}
                    }),
                    guard : (context)=> context.event.tool == "measure"
                },
                {
                    target :"active.angle",
                    actions : assign((context)=>{
                        console.log(context)
                        return {selectedTool : context.event.tool}
                    }),
                    guard : (context)=> context.event.tool == "angle"
                }]
            }
        },

        active : {
            initial : "angle",
            states : {


                measure : {
                    entry: ()=>{console.log("Measure")},
                    on:{
                        SELECT_TOOL : {
                            target : "angle",
                            guard : (context)=> context.event.tool == "angle",
                        },

                        MEASURE :[ {
                            actions : assign((context)=>{
                                const measure = context.event.measure;
                                const isWarning = measure>90;
                                return {isMeasureValueWarning : isWarning}
                            }),

                            target : "measureValueWarning",
                            guard : (context)=>context.event.measure > 90
                        },
                        {
                            actions : assign((context)=>{
                                const measure = context.event.measure;
                                const isWarning = measure>90;
                                return {isMeasureValueWarning : isWarning}
                            }),
                            target : "measureValueDisplayed",
                            guard: (context)=>context.event.measure <= 90
                        }
                    ]
                    }
                },

                measureValueWarning :{
                    entry: (context)=>{console.log(`ismeasurevalue : ${context.context.isMeasureValueWarning}`)},
                    on : {
                        CONFIRM : {
                            target : "measureValueDisplayed",
                            guard : (context) => context.context.isMeasureValueWarning
                        },

                        CANCEL : {
                            target : "measure",
                            actions :  assign((context, event) => {
                                return {isMeasureValueWarning: false};
                            })
                        }
                    }
                },

                measureValueDisplayed : {
                    on : {
                        DRAW_COMPLETE : {
                            target : "measure",
                            actions : assign((context)=>{
                                return {isMeasureValueDisplayed : true}
                            })
                        }
                    }
                },


                angle : {
                    entry: ()=>{console.log("Angle")},
                    on : {
                        SELECT_TOOL : {
                            target : "measure",
                            guard : (context)=>{
                                return context.event.tool == "measure"},
                        }
                    }
                }
            },

            on : {
                DESELECT_TOOL : 
                {
                  
                    target : "idle",
                    actions : assign((context,event)=>{
                        return {selectedTool : null}
                    })
                }
            }
        }


    }
})



// sihosad275@etopys.com