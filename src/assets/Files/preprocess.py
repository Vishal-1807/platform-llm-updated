# You can import external libraries as long as they are added in to a requirements.txt file
# and uploaded along with this file. There are certain libraries with frozen versions for this version of CIBI
# Refer to the docs to see what they are. Users currently cannot modify these package versions
import pandas as pd
from loguru import logger

# You can add as many helper methods as you need in this file with one catch
# the function called during the pipeline will only be the one named "transform"
# So plan to pack you helper methods in to transform


def create_label(df: pd.DataFrame) -> pd.DataFrame:
    '''
    Example helper method to create labels from raw data
    '''
    logger.info("Creating label from raw data")
    # Your label logic goes here
    # For eg: df['label'] = 1 if condition else 0
    # Helper methods like this can take any signatures and its completely upto you to engineer them into
    # transform function
    return df

def custom_helper_function(string: str) -> int:
    '''
    One more example with a different function signature
    '''
    return int(string.lower().contains('Mr.'))


def transform(df, **kwargs):
    '''
    This is the main function that get executed both during train and inference cycles.
    kwargs is mandatory as its used to inject variables into this function during runtime.
    '''
    df['has_mr_title'] = df['Name'].apply(custom_helper_function)
    if not kwargs.get('inference'):
        # `inference` kwarg is used to switch the behaviour of this function between training
        #  and inference sessions. Always keep anything related to your label or anything you want to 
        #  exclude during inference inside this block
        df = create_label(df)
    return df