/* Author: Nathan Hu
It is ok to share my code anonymously for educational purposes */



#include <algorithm>
#include <iostream>
#include <cmath>
#include <vector>
using namespace std;

typedef long long ll;
typedef vector<long long> vi;

int main()
{
    ll ndays = 0;
    ll max_shares = 100000;
    vector<ll> prices(ndays);
    cin >> ndays;
	
    ll stocks = 0;
    ll cash = 100;
	//parsing
    for (ll i = 0; i < ndays; i++) {
        ll price;
        cin >> price;
        prices.push_back(price);
    }

    for (ll i = 0; i < prices.size() - 1; i++) {
        ll x = prices[i];
        ll y = prices[i+1];
        if (y > x) {
            ll v = min(100000-stocks, cash / x); //buy low, up to 100000 stocks
            stocks += v;
            cash -= x * v;
        }
        else {
			//sell high
            cash += stocks * x;
            stocks = 0;
        }
    }
    cash += stocks * prices[prices.size() - 1]; //always sell at the end
    cout << cash;
    return 0;
}
